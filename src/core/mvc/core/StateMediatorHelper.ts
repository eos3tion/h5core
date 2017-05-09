module junyou {

    export interface AwakeCheck {
        awakeCheck?: () => boolean;
    }

    /**
     * 将Mediator转换为IStateSwitcher
     * 
     * @export
     * @param {Mediator} mediator
     * @returns {(Mediator & IStateSwitcher & AwakeCheck)}
     */
    export function transformToStateMediator(mediator: Mediator, awakeBy?: { (id: number): void }, sleepBy?: { (id: number): void }): Mediator & IStateSwitcher & AwakeCheck {
        let stateMed = <Mediator & IStateSwitcher & AwakeCheck>mediator;
        if (stateMed.awakeBy === undefined) {
            stateMed.awakeBy = awakeBy || function (id: number) {
                if (typeof stateMed.awakeCheck === "function") {
                    if (!stateMed.awakeCheck()) {
                        return;
                    }
                }
                const view = this._view;
                if (view instanceof Panel) {
                    view.show();
                }
            }
        }
        if (stateMed.sleepBy === undefined) {
            stateMed.sleepBy = sleepBy || function (id: number) {
                const view = this._view;
                if (view instanceof Panel) {
                    view.hide();
                }
            }
        }
        return stateMed;

    }

}