namespace jy {

    export const enum ConditionOperator {
        /**
         * 具体值
         */
        Value = 1,
        BracketsMask = 0b100000000000,
        /**
         * 括号
         */
        Brackets = BracketsMask | 0,
        /**
         * 函数
         */
        Function = BracketsMask | 1,
        /**
         * 比较  
         * = > < <> >= <=
         */
        Comperation = 2,
    }


    export interface ConditionNode {
        parent: ConditionNode;
        op: ConditionOperator;
        nodes: ConditionNode[];
        value: string;
        /**
         * 原始内容
         */
        raw: string;
        /**
         * 起始索引
         */
        start: number;
        /**
         * 结束索引
         */
        end: number;
    }

    export interface ConditionCheckContext {
        /**
         * 不符合条件的错误
         */
        errors?: string[];
    }


    const Comparations =
        ["=", "<", ">"];

    export class Condition {

        /**
         * 注册值处理器
         */
        static setValueSolver(solver: ConditionValueSolver) {
            conditionValueSolver = solver;
        }

        static setMsgSolver(solver: ConditionMsgSolver) {
            conditionMsgSolver = solver;
        }

        /**
         * 注册函数处理器
         * @param funcName 
         * @param handler 
         */
        static regFuncSolver(funcName: string, handler: ConditionFuncSolver) {
            //新的直接覆盖旧的
            funcSolvers[funcName.toLowerCase()] = handler;
        }

        /**
         * 设置tip处理器
         * @param tipHandler 
         */
        static setTip(tipHandler: ShowConditionTip) {
            showTip = tipHandler;
        }

        readonly root: ConditionNode;

        /**
         * 上下文数据
         * @param context 
         */
        check(context?: ConditionCheckContext) {
            let root = this.root;
            let flag = !root || getValue(root, context);
            if (!flag && context) {
                let errors = context.errors;
                if (errors) {
                    showTip(errors);
                }
            }
            return flag;
        }

        decode(content: string) {
            if (content) {
                let pos = 0;
                let len = content.length;
                let nod = {
                    raw: content.trim(),
                    start: pos,
                    end: len,
                    nodes: []
                } as ConditionNode;
                //@ts-ignore
                this.root = nod;
                while (pos < len) {
                    let char = content.charAt(pos);
                    if (char == "(") {
                        let raw = content.substring(nod.start, pos);
                        let func = raw.trim();
                        let node = {
                            start: pos + 1,
                            nodes: [],
                            parent: nod,
                        } as ConditionNode;
                        nod.nodes.push(node);
                        if (func) {
                            nod.op = ConditionOperator.Function;
                            nod.value = func.toLowerCase();
                        } else {
                            nod.op = ConditionOperator.Brackets;
                        }
                        nod = node;
                    } else if (char == ",") {
                        let raw = content.substring(nod.start, pos);
                        nod.end = pos;
                        nod.raw = raw;
                        if (!nod.op) {
                            nod.op = ConditionOperator.Value;
                            nod.value = raw;
                        }
                        let value = raw.trim();
                        do {
                            nod = nod.parent;
                        } while (nod && !isBrackedsType(nod.op))
                        let node = {
                            start: pos + 1,
                            nodes: [],
                            parent: nod,
                            raw,
                            value,
                        } as ConditionNode;
                        nod.nodes.push(node);
                        nod = node;
                    } else if (Comparations.indexOf(char) > -1) {
                        if (nod.op) {
                            throw Error(`${char}左边没有正确的比较值，请检查：${content.substring(0, pos)}`)
                        }
                        nod.op = ConditionOperator.Comperation;
                        let nextStart = pos + 1;
                        let nextChar = content.charAt(pos + 1);
                        if (char == "<") {
                            if (nextChar == "=" || nextChar == ">") {
                                nod.value = char + nextChar;
                                nextStart++;
                            }
                        } else if (char == ">") {
                            if (nextChar == "=") {
                                nod.value = char + nextChar;
                                nextStart++;
                            }
                        }
                        let raw = content.substring(nod.start, pos);
                        let node = {
                            start: nextStart,
                            nodes: [],
                            parent: nod
                        } as ConditionNode;
                        nod.nodes.push({
                            op: 1,
                            start: nod.start,
                            end: pos,
                            parent: nod,
                            raw,
                            value: raw,
                        } as ConditionNode, node)
                        nod = node;
                        pos = nextStart - 1;
                    } else if (char == ")") {
                        nod.end = pos;
                        let raw = content.substring(nod.start, pos);
                        nod.raw = raw;
                        if (!nod.op) {
                            nod.op = ConditionOperator.Value;
                            nod.value = raw;
                        }
                        do {
                            nod = nod.parent;
                            if (nod) {
                                nod.end = pos;
                                if (isBrackedsType(nod.op)) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        } while (true)
                    }
                    pos++;
                }
                if (nod.value == undefined) {
                    nod.op = ConditionOperator.Value
                    let raw = content.substring(nod.start, pos);
                    nod.raw = raw;
                    nod.value = raw;
                }
            }
            return this;
        }
    }

    function checkComparation(node: ConditionNode, context: ConditionCheckContext) {
        const { nodes, value } = node;
        let [c1, c2] = nodes;
        let v1 = getValue(c1, context);
        let v2 = getValue(c2, context);
        let flag = true;
        switch (value) {
            case "=":
                flag = v1 == v2;
            case "<":
                flag = v1 < v2;
            case ">":
                flag = v1 > v2;
            case "<>":
                flag = v1 != v2;
            case "<=":
                flag = v1 <= v2;
            case ">=":
                flag = v1 >= v2;
        }
        if (!flag && context) {
            let errors = context.errors;
            if (errors) {
                errors.push(conditionMsgSolver(node, context))
            }
        }

        return flag;
    }

    function getValue(node: ConditionNode, context: ConditionCheckContext) {
        const { op, value } = node;
        switch (op) {
            case ConditionOperator.Value:
                return conditionValueSolver(value, context);
            case ConditionOperator.Function:
                return getFunc(node, context);
            case ConditionOperator.Comperation:
                return checkComparation(node, context);
        }
    }

    let conditionValueSolver: ConditionValueSolver = Temp.pipeFunction;

    const funcSolvers = {
        and: function (nodes, context) {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (!getValue(node, context)) {
                    return false;
                }
            }
            return true;
        },
        or: function (nodes, context) {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (getValue(node, context)) {
                    return true;
                }
            }
            return false;
        }

    } as { [func: string]: ConditionFuncSolver }

    export type ConditionFuncSolver = { (nodes: ConditionNode[], context: ConditionCheckContext) };
    export type ConditionValueSolver = { (value: string, context: ConditionCheckContext): any };
    export type ConditionMsgSolver = { (node: ConditionNode, context: ConditionCheckContext): string };

    export type ShowConditionTip = { (msgs: string[]) };

    let showTip: ShowConditionTip = Temp.voidFunction;

    let conditionMsgSolver: ConditionMsgSolver = function (node) {
        return node.raw;
    };

    function getFunc({ value, nodes }: ConditionNode, context: ConditionCheckContext) {
        let handler = funcSolvers[value];
        return handler(nodes, context)
    }


    function isBrackedsType(op: ConditionOperator) {
        return (op & ConditionOperator.BracketsMask) == ConditionOperator.BracketsMask
    }
}