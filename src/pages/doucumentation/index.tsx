import { useState, useEffect, type FC } from 'react';

import { Button, Typography, Input } from 'antd';

import { Web3 } from 'web3';

import ABI from '@/abi/bank.json';
import '@/assets/css/doucumentation.scss';

const { Title, Paragraph } = Typography;

const DoucumentationPage: FC = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [address, setAddress] = useState<string>('');
  const [bankContract, setBankContract] = useState<any>();
  const [myDeposit, setMyDeposit] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<string>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<string>(0);
  const [transferAmount, setTransferAmount] = useState<string>(0);
  const [receiveAddress, setReceiveAddress] = useState<string>('');

  // 当页面加载时，从 localStorage 恢复数据
  // useEffect(() => {
  //   const storedAddress = localStorage.getItem('address');
  //   const storedWeb3 = localStorage.getItem('web3');
  //   const storedContract = localStorage.getItem('bankContract');

  //   if (storedAddress && storedWeb3 && storedContract) {
  //     setAddress(storedAddress);
  //     setWeb3(new Web3(storedWeb3));
  //     setBankContract(JSON.parse(storedContract));
  //   }
  // }, []);

  const connectWallet = async () => {
    // get wallet address
    console.log(window);

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(typeof window.ethereum);

    setAddress(accounts[0]);

    // get web3 instance
    const web3 = new Web3(window.web3.currentProvider);
    setWeb3(web3);

    // get smart contract instance: ABI + contract address
    const contract = new web3.eth.Contract(ABI, '0x6EBA0d2E86a2B7962cb4cB80B8A0A6024571063f');
    setBankContract(contract);

    // // 将数据保存在 localStorage 中
    // localStorage.setItem('address', accounts[0]);
    // localStorage.setItem('web3', JSON.stringify(web3));
    // localStorage.setItem('bankContract', JSON.stringify(contract));
  };

  // get my deposit
  const getMyDeposit = async () => {
    console.log(bankContract);
    const deposit = await bankContract.methods.getBalance().call({ from: address });
    console.log('deposit:', Number(deposit));
    setMyDeposit( Number(deposit));
  };

  // deposit
  const deposit = async () => {
    console.log(depositAmount);
    await bankContract.methods.deposit(depositAmount).send({ from: address });
  };

  // withdraw
  const withdraw = async () => {
    await bankContract.methods.withdraw(withdrawAmount).send({ from: address });
  };

  // transfer
  const transfer = async () => {
    await bankContract.methods.bankTransfer(receiveAddress, transferAmount).send({ from: address });
  };
 
  return (
    <div className="flex-center-center">
      <div className="container flex-column gap-12">
        <Button onClick={connectWallet}>连接钱包</Button>
        <div>钱包地址:{address}</div>
        <div>
          银行余额：{myDeposit} <Button onClick={getMyDeposit}>查询</Button>
        </div>
        <div className="flex-center-between gap-6">
          <Input
            placeholder="请输入金额"
            onChange={e => {
              console.log(e);
              setDepositAmount(e.target.value);
            }}
          ></Input>
          <Button onClick={deposit}>存钱</Button>
        </div>
        <div className="flex-center-between gap-6 ">
          <Input
            placeholder="请输入金额"
            onChange={e => {
              setWithdrawAmount(e.target.value);
            }}
          ></Input>
          <Button onClick={withdraw}>取钱</Button>
        </div>
        <div className="flex-center-between gap-6">
          <Input
            placeholder="接收地址"
            onChange={e => {
              setReceiveAddress(e.target.value);
            }}
          ></Input>
          <Input
            placeholder="请输入金额"
            onChange={e => {
              setTransferAmount(e.target.value);
            }}
          ></Input>
          <Button onClick={transfer}>转账</Button>
        </div>
      </div>
    </div>
  );
};

export default DoucumentationPage;
