import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const SimpleStorageModule = buildModule("SimpleStorage", (m) => {
    const simple_storage = m.contract("SimpleStorage");

    return {simple_storage};
});

export default SimpleStorageModule;
