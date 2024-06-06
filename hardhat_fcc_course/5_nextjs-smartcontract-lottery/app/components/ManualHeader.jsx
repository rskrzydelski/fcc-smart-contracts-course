import { useMoralis } from "react-moralis";

export function ManualHeader() {
    const { enableWeb3 } = useMoralis();

    return <div>Header</div>;
}
