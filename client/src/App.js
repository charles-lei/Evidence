import React, { Component } from "react";
import EvidenceSystem from "./contracts/EvidenceSystem.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { 
      contractAddress: "0x36650c2883215ab88406c81729b1d31b65123261",
      storageValue: 0,
      web3: null, 
      accounts: null,
      contractInstance: null,
      contract: null,
      loading: false,
      input: '',
      myEvidences: [],
      firstTimeLoad: true,
      loadingTip: "请确认交易并耐心等待...",
      successTip: "登记成功"
    }

  componentWillMount = async () => {
    try{
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = truffleContract(EvidenceSystem);
      contract.setProvider(web3.currentProvider);
      const contractInstance = await contract.at(this.state.contractAddress)
      this.setState({web3, accounts, contract, contractInstance},  this.runExample);
    }catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  getMyEvidences = async () => {
    const {myEvidences = [], accounts, contractInstance, web3} = this.state;
    const length = await contractInstance.getEvidenceLength({from: accounts[0]});
    for (var i = 0; i < length.toNumber(); i++) {
      var evidence = await contractInstance.getEvidence(i, {from: accounts[0]});
      myEvidences.push(evidence);
      this.setState({myEvidences});
    }
  }

  runExample = async () => {
    this.getMyEvidences();
  }

  inputEvidence(e){
    this.setState({
      input: e.target.value
    })
  }

  setEvidence () {
    if(!this.state.input) return
    const that = this
    this.setState({
      loading: true,
      loadingTip: "请确认交易并耐心等待..."
    })
    this.state.contractInstance.storeEvidence(this.state.input,{from: this.state.accounts[0]})
    .then(result=>{
      this.setState({
        loadingTip: that.state.successTip
      })
      setTimeout(() => {
        that.setState({
            loading: false,
            input: ''
        })
      }, 1500)
      const {myEvidences = []} = this.state;
      this.state.contractInstance.getEvidence(myEvidences.length, {from: this.state.accounts[0]}).then(evidence=>{
        myEvidences.push(evidence);
        this.setState({myEvidences});
      });
    })
    .catch(e => {
        this.setState({
            loading: false
        })
    })   
  }
  // 时间戳转义
  formatTime(timestamp) {
      let date = new Date(Number(timestamp)*1000)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      let fDate = [year, month, day, ].map(this.formatNumber)
      return fDate[0] + '年' + fDate[1] + '月' + fDate[2] + '日' + ' ' + [hour, minute, second].map(this.formatNumber).join(':') 
  }
  /** 小于10的数字前面加0 */
  formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
  }
  render() {
    var listMyEvidences = () => {
      var res = [];
      for(var i = 0; i < this.state.myEvidences.length; i++) {
        var myEvidence = this.state.myEvidences[i];
        res.push(<li key={i}>{myEvidence[0]} {this.formatTime(myEvidence[1].toNumber())}</li>)
      }
      return res
    }
    return (
      <div className="container">
        <header className="header">版权登记系统</header>
        <main>
          <div className="main-container">
            <div className="setword">
              <input type="text" value={this.state.input} onChange={e => this.inputEvidence(e)}/>
              <button onClick={() => this.setEvidence()}>登记</button>
            </div>
            <div className="tips">
              <div>
                {this.state.myEvidences.length > 0 ? <p>我的存证列表：</p>: ""}
                <ul>
                  {listMyEvidences()}
                </ul>
              </div>
            </div>
          </div>
        </main>
        <footer>本程序参考来自网名为<a href="https://www.ldsun.com" target="_blank"> Ludis </a> 的作品</footer>
        <div className={this.state.loading? "loading show": "loading"}>
            <img src={require("./utils/loading/loading-bubbles.svg")} alt="" width="128" height="128"/>
            <p>{this.state.loadingTip}</p>
        </div>
      </div>
    );
  }
}

export default App;
