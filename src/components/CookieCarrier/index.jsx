import React, {Component} from 'react';
import {Input, Switch} from 'antd'

import {CheckOutlined} from '@ant-design/icons';

import './index.less'

export default class CookieCarrier extends Component {

    state = {
        cookieStatus: null,
        getStatus: false,
        superCookieList: [],
        CORSCookies: [],

        tempCORSCookie: { start: '', end: '' }
    }

    componentDidMount() {
        this.setCookieStatus()
        chrome.storage.local.get(['superCookieList', 'CORSCookies'], (result) => {
            console.log(result)
            this.setState({superCookieList:result.superCookieList||[], CORSCookies: result.CORSCookies})
        })
    }

    setCookieStatus = (cookieStatus = null,superCookieList=null) => {
        chrome.runtime.sendMessage(
            {
                type: 'cookieStatus',
                cookieStatus,
                superCookieList
            },
            (res) => {
                if (res.success) {
                    this.setState({cookieStatus: res.cookieStatus, getStatus: true})
                }
            }
        );
    }

    setCORSCookie = (CORSCookies = null) => {
        chrome.runtime.sendMessage(
            {
                type: 'setCORSCookies',
                CORSCookies
            },
            (res) => {
                if (res.success) {
                    
                }
            }
        );
    }

    render() {
        let {cookieStatus, getStatus, superCookieList, tempCookie, CORSCookies, tempCORSCookie} = this.state;
        return [
            <div>
                {
                    getStatus ?
                        <div className='CookieCarrier'>
                            <div>
                                强制携带cookie：
                                <Switch defaultChecked
                                        checked={this.state.cookieStatus}
                                        onChange={() => {
                                            this.setCookieStatus(!cookieStatus)
                                        }}/>
                                <span className='CookieCarrier-ex-text'>建议仅开发时打开</span>
                            </div>
                            <div style={{marginTop:'20px'}}>
                                <div>如果打开开关仍不行，再将Domain添加至列表</div>
                                {
                                    superCookieList.map((item, index) => {
                                        return <div>
                                            <span>{item}</span>
                                            <span className='CookieCarrier-delete'
                                                           onClick={() => {
                                                               superCookieList.splice(index, 1)
                                                               this.setState({superCookieList}, () => {
                                                                   this.setCookieStatus(null,superCookieList)
                                                               })
                                                           }}>删除</span>
                                        </div>
                                    })
                                }
                                <Input value={tempCookie}
                                       style={{width: '200px'}}
                                       onChange={(e) => {
                                           this.setState({tempCookie: e.target.value})
                                       }}/>
                                <CheckOutlined className='CookieCarrier-confirm'
                                               onClick={() => {
                                                   superCookieList.push(tempCookie)
                                                   this.setState({superCookieList, tempCookie: ''},()=>{
                                                       this.setCookieStatus(true,superCookieList)
                                                   })
                                               }}
                                />

                                <div style={{marginTop: '10px'}}>
                                    <div>跨站cookie共享：</div>

                                    {
                                        CORSCookies.map((item, index) => {
                                            return <div>
                                                <span>{item.start}</span> 至 <span>{item.end}</span>
                                                <span className='CookieCarrier-delete'
                                                    onClick={() => {
                                                        CORSCookies.splice(index, 1)
                                                        this.setState({CORSCookies}, () => {
                                                            this.setCORSCookie(CORSCookies)
                                                        })
                                                    }}>删除</span>
                                            </div>
                                        })
                                    }

                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Input value={tempCORSCookie.start}
                                        style={{width: '130px', height: '28px'}}
                                        onChange={(e) => {
                                            this.setState({tempCORSCookie: { ...tempCORSCookie, start: e.target.value }})
                                        }}
                                        />

                                        <span style={{margin: '0 4px'}}>至</span>

                                        <Input value={tempCORSCookie.end}
                                        style={{width: '130px', height: '28px'}}
                                        onChange={(e) => {
                                            this.setState({tempCORSCookie: { ...tempCORSCookie, end: e.target.value }})
                                        }}
                                        />
                                        
                                        <CheckOutlined className='CookieCarrier-confirm'
                                            onClick={() => {
                                                CORSCookies.push(tempCORSCookie)
                                                this.setState({CORSCookies, tempCORSCookie: { start: '', end: '' }},()=>{
                                                    this.setCORSCookie(CORSCookies)
                                                })
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{color:'darkgrey'}}>在哪里查看Domain？</div>
                                <div style={{color:'darkgrey'}}>F12-Application-Cookie-Domain</div>
                            </div>
                        </div> : 'loading'
                }
            </div>
        ]

    }
}