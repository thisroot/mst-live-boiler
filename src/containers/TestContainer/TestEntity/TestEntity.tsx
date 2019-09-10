import React from "react"
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from "react-router";

interface ITestProps extends RouteComponentProps {}

const TestEntity: React.SFC<ITestProps> = observer((props: ITestProps) => {
        return <div>TestEntity: { JSON.stringify(props.match.params) }</div>
    }
)

export { TestEntity }
