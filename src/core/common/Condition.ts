namespace jy {

    const enum Operator {
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


    interface Node {
        parent: Node;
        op: Operator;
        nodes: Node[];
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


    const Comparations =
        ["=", "<", ">"];

    export class Condition {

        /**
         * 注册值处理器
         */
        static setValueSolver(solver: ConditionValueSolver) {
            conditionValueSolver = solver;
        }

        /**
         * 注册函数处理器
         * @param funcName 
         * @param handler 
         */
        static regFuncSolver(funcName: string, handler: ConditionFuncSolver) {
            //新的直接覆盖旧的
            funcSolvers[funcName] = handler;
        }

        readonly root: Node;

        /**
         * 上下文数据
         * @param context 
         */
        check(context?: any) {
            let root = this.root;
            return !root || getValue(root, context);
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
                } as Node;
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
                        } as Node;
                        nod.nodes.push(node);
                        if (func) {
                            nod.op = Operator.Function;
                            nod.value = func;
                        } else {
                            nod.op = Operator.Brackets;
                        }
                        nod = node;
                    } else if (char == ",") {
                        let raw = content.substring(nod.start, pos);
                        nod.end = pos;
                        nod.raw = raw;
                        if (!nod.op) {
                            nod.op = Operator.Value;
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
                        } as Node;
                        nod.nodes.push(node);
                        nod = node;
                    } else if (Comparations.indexOf(char) > -1) {
                        if (nod.op) {
                            throw Error(`${char}左边没有正确的比较值，请检查：${content.substring(0, pos)}`)
                        }
                        nod.op = Operator.Comperation;
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
                        } as Node;
                        nod.nodes.push({
                            op: 1,
                            start: nod.start,
                            end: pos,
                            parent: nod,
                            raw,
                            value: raw,
                        } as Node, node)
                        nod = node;
                        pos = nextStart - 1;
                    } else if (char == ")") {
                        nod.end = pos;
                        let raw = content.substring(nod.start, pos);
                        nod.raw = raw;
                        if (!nod.op) {
                            nod.op = Operator.Value;
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
            }
            return this;
        }
    }

    function checkComparation({ nodes, value }: Node, context: any) {
        let [c1, c2] = nodes;
        let v1 = getValue(c1, context);
        let v2 = getValue(c2, context);
        switch (value) {
            case "=":
                return v1 == v2;
            case "<":
                return v1 < v2;
            case ">":
                return v1 > v2;
            case "<>":
                return v1 != v2;
            case "<=":
                return v1 <= v2;
            case ">=":
                return v1 >= v2;
        }
    }

    function getValue(node: Node, context: any) {
        const { op, value } = node;
        switch (op) {
            case Operator.Value:
                return conditionValueSolver(value, context);
            case Operator.Function:
                return getFunc(node, context);
            case Operator.Comperation:
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

    export type ConditionFuncSolver = { (nodes: Node[], context: any) };
    export type ConditionValueSolver = { (value: string, context: any): any };


    function getFunc({ value, nodes }: Node, context: any) {
        let handler = funcSolvers[value];
        return handler(nodes, context)
    }


    function isBrackedsType(op: Operator) {
        return (op & Operator.BracketsMask) == Operator.BracketsMask
    }
}