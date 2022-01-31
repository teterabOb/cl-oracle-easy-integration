/* eslint-disable react-hooks/exhaustive-deps */
import {
    Steps
    
} from "antd";

export default function StepsOracle() {

    return (
        <>
            <Steps>
                <Steps.Step status="process" title="Select Oracle to Administrate" />
                <Steps.Step status="process" title="Adinistrate or Try out Price Feed" />
                <Steps.Step status="process" title="Administrate Trusted Callers" />
            </Steps>
        </>
    )
}
