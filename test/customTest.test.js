import { toNum, encodeAccounts, decodeAccounts, decodeLogs, getCode } from './utils';
import fixtures from './fixtures';
import Runtime from './helpers/runtimeAdapter';

const OP = require('./helpers/constants');
const { PUSH1, BLOCK_GAS_LIMIT, DEFAULT_CALLER } = OP;

const EthereumRuntime = artifacts.require('EthereumRuntime.sol');

contract('Runtime', function () {
  let rt;

  before(async () => {
    rt = new Runtime(await EthereumRuntime.new());
  });

  describe('initAndExecute', () => {
    it('From Step0 to Step2', async () => {
      // const code = '0x' + PUSH1 + '03' + PUSH1 + '05' + OP.ADD;
      const code = '0x' + PUSH1 + '00' + OP.SSTORE;
      const pc = 0;
      const pcCount = 2;
      // const initialStack = ['0x64','0x58','0x60fe47b1'];
      // const initialStack = [parseInt('0x64',16),parseInt('0x58',16),parseInt('0x60fe47b1',16)];
      // 리틀 엔디안, 새로운 스택은 뒤로 쌓인다.
      const initialStack = [0x60fe47b1, 0x58, 0x64];
      //**메모리는 64hex(32byte) 단위로 넣어야한다!!
      const initialMemory = '0x00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000080';
      const rawAccounts = [
        {
          address: '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a',
          storage: [{address: 0, value: 1}]
        }
      ];
      //TODO : 어카운트코드 넣는법 다시 확인
      // const { accounts, accountsCode } = encodeAccounts(rawAccounts);
      const { accounts } = encodeAccounts(rawAccounts);
      const accountsCode = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563';

      // console.log("어카운트 : ", accounts);
      // console.log("어카운트코드 : ", accountsCode);

      const callData = '0x60fe47b10000000000000000000000000000000000000000000000000000000000000064';
      const blockGasLimit = BLOCK_GAS_LIMIT;
      const gasLimit = blockGasLimit;
      const logs = [];
      const logsData ='0x';

      const res = await rt.initAndExecute(
        code, callData,
        [pc, pcCount, blockGasLimit, gasLimit],
        initialStack, initialMemory, accounts, accountsCode, logs, logsData,
      );

      console.log("0.Current PC: ", res.pc);
      console.log("1.Stack : ", res.stack.map(word => word.toString(16)));
      console.log("2.Memory : ", res.memory);
      console.log("3.Accounts : ", res.accounts.map(account => account.toString(16)));
      console.log("");
    });

    it('From Step2 to Step3', async () => {
      // const code = '0x' + PUSH1 + '03' + PUSH1 + '05' + OP.ADD;
      const code = '0x' + PUSH1 + '00' + OP.SSTORE;
      const pc = 2;
      const pcCount = 3;
      // const initialStack = ['0x64','0x58','0x60fe47b1'];
      // const initialStack = [parseInt('0x64',16),parseInt('0x58',16),parseInt('0x60fe47b1',16)];
      // 리틀 엔디안, 새로운 스택은 뒤로 쌓인다.
      const initialStack = [0x60fe47b1, 0x58, 0x64, 0x00];
      //**메모리는 64hex(32byte) 단위로 넣어야한다!!
      const initialMemory = '0x00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000080';
      const rawAccounts = [
        {
          address: '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a',
          storage: [{address: 0, value: 1}]
        }
      ];
      //TODO : 어카운트코드 넣는법 다시 확인
      // const { accounts, accountsCode } = encodeAccounts(rawAccounts);
      const { accounts } = encodeAccounts(rawAccounts);
      const accountsCode = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563';

      // console.log("어카운트 : ", accounts);
      // console.log("어카운트코드 : ", accountsCode);

      const callData = '0x60fe47b10000000000000000000000000000000000000000000000000000000000000064';
      const blockGasLimit = BLOCK_GAS_LIMIT;
      const gasLimit = blockGasLimit;
      const logs = [];
      const logsData ='0x';

      const res = await rt.initAndExecute(
        code, callData,
        [pc, pcCount, blockGasLimit, gasLimit],
        initialStack, initialMemory, accounts, accountsCode, logs, logsData,
      );

      console.log("0.Current PC: ", res.pc);
      console.log("1.Stack : ", res.stack.map(word => word.toString(16)));
      console.log("2.Memory : ", res.memory);
      console.log("3.Accounts : ", res.accounts.map(account => account.toString(16)));
      console.log("");
    });

    it('From Step0 to Step1 Test for Gas', async () => {
      // const code = '0x' + PUSH1 + '03' + PUSH1 + '05' + OP.ADD;
      const code = '0x' + PUSH1 + '00' + OP.SSTORE;
      const pc = 0;
      const pcCount = 1;
      // const initialStack = ['0x64','0x58','0x60fe47b1'];
      // const initialStack = [parseInt('0x64',16),parseInt('0x58',16),parseInt('0x60fe47b1',16)];
      // 리틀 엔디안, 새로운 스택은 뒤로 쌓인다.
      const initialStack = [0x60fe47b1, 0x58, 0x64];
      //**메모리는 64hex(32byte) 단위로 넣어야한다!!
      const initialMemory = '0x00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000080';
      const rawAccounts = [
        {
          address: '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a',
          storage: [{address: 0, value: 1}]
        }
      ];
      //TODO : 어카운트코드 넣는법 다시 확인
      // const { accounts, accountsCode } = encodeAccounts(rawAccounts);
      const { accounts } = encodeAccounts(rawAccounts);
      const accountsCode = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563';

      // console.log("어카운트 : ", accounts);
      // console.log("어카운트코드 : ", accountsCode);

      const callData = '0x60fe47b10000000000000000000000000000000000000000000000000000000000000064';
      const blockGasLimit = BLOCK_GAS_LIMIT;
      const gasLimit = blockGasLimit;
      const logs = [];
      const logsData ='0x';

      const resTest = await rt.initAndExecuteTest(
        code, callData,
        [pc, pcCount, blockGasLimit, gasLimit],
        initialStack, initialMemory, accounts, accountsCode, logs, logsData,
      );

    });

    it('From Step0 to Step2 Test for Gas', async () => {
      // const code = '0x' + PUSH1 + '03' + PUSH1 + '05' + OP.ADD;
      const code = '0x' + PUSH1 + '00' + OP.SSTORE;
      const pc = 0;
      const pcCount = 2;
      // const initialStack = ['0x64','0x58','0x60fe47b1'];
      // const initialStack = [parseInt('0x64',16),parseInt('0x58',16),parseInt('0x60fe47b1',16)];
      // 리틀 엔디안, 새로운 스택은 뒤로 쌓인다.
      const initialStack = [0x60fe47b1, 0x58, 0x64];
      //**메모리는 64hex(32byte) 단위로 넣어야한다!!
      const initialMemory = '0x00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000000'+'00000000000000000000000000000080';
      const rawAccounts = [
        {
          address: '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a',
          storage: [{address: 0, value: 1}]
        }
      ];
      //TODO : 어카운트코드 넣는법 다시 확인
      // const { accounts, accountsCode } = encodeAccounts(rawAccounts);
      const { accounts } = encodeAccounts(rawAccounts);
      const accountsCode = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563';

      // console.log("어카운트 : ", accounts);
      // console.log("어카운트코드 : ", accountsCode);

      const callData = '0x60fe47b10000000000000000000000000000000000000000000000000000000000000064';
      const blockGasLimit = BLOCK_GAS_LIMIT;
      const gasLimit = blockGasLimit;
      const logs = [];
      const logsData ='0x';

      const resTest = await rt.initAndExecuteTest(
        code, callData,
        [pc, pcCount, blockGasLimit, gasLimit],
        initialStack, initialMemory, accounts, accountsCode, logs, logsData,
      );

    });

  });

});
