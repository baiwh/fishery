import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Table, Card, Row, Col, Input, Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import AddUser from './AddUser'

const Search = Input.Search;
@connect(state => ({
    list: state.commonUser.list,
    loading: state.commonUser.loading,
    pagination: state.commonUser.pagination
}))

class UserList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            view: false,
            selectedRows: [],
            selectedRowKeys: [],
            mode: 'add',
            index: '',
            modifyId: ''
        }
    }

    componentDidMount() {
        this.onSearch()
    }


    showAddModal = (mode = 'add', index, id) => {
        if (mode == 'add') {
            this.props.dispatch({
                type: 'commonUser/changeModal',
                payload: {
                    formData: { fields: {} }
                }
            })
        }

        this.setState({
            view: true,
            mode: mode,
            index: index,
            modifyId: id
        })
    }

    modifyInfo = (record, index) => {
        let formData = {}
        for (let key in record) {
            formData[key] = {
                value: record[key],
                name: key
            }
        }
        this.props.dispatch({
            type: 'commonUser/changeModal',
            payload: {
                formData: { fields: formData }
            }
        })
        this.showAddModal('modify', index, record.id)
    }

    onOk = (values) => {
        if (!this.state.modifyId && this.state.modifyId !== 0) {
            
            this.props.dispatch({
                type: 'commonUser/addUser',
                payload: values,
            });
        } else {
            values.id = this.state.modifyId
            this.props.dispatch({
                type: 'commonUser/modifyWXUser',
                payload: {
                    index: this.state.index,
                    data: values
                },
            });
        }
        this.setState({
            view: false
        })
    }

    onSearch = (value) => {
        this.props.dispatch({
            type: 'commonUser/fetch',
            payload: {
                name: value,
                number: 10,
                page: 1
            },
        })
    }


    onCancel = () => {
        this.setState({
            view: false
        })
    }

    handleTableChange = (pagination) => {
        const pager = { ...this.props.pagination };
        pager.current = pagination.current;
        this.props.dispatch({
            type: 'commonUser/fetch',
            payload: {
                number: 10,
                page: pagination.current,
            },
        });
        this.props.dispatch({
            type: 'commonUser/changeModal',
            payload: { pagination: pager }
        })
    }

    onDelete = (idArray) => {
      
    
        this.setState({
            selectedRowKeys:[]
        })
        this.props.dispatch({
            type: 'commonUser/deleteUser',
            payload: {
                WXUserIds: idArray,
                pagination: this.props.pagination
            },
        });
    }


    render() {
        const { list, loading } = this.props;
        const rowSelection = {
            //针对全选
            onSelectAll: (selected, selectedRows, changeRows) => {
                let origKeys = this.state.selectedRowKeys;
                let origRows = this.state.selectedRows;
                if (selected) {
                    origRows = [...origRows, ...changeRows];
                    for (let item of changeRows) {
                        origKeys.push(item.id);
                    }
                } else {
                    for (let change of changeRows) {
                        origKeys = origKeys.filter((obj) => {
                            return obj !== change.key;
                        });
                        origRows = origRows.filter((obj) => {
                            return obj.key !== change.key;
                        });
                    }
                }
                this.setState({
                    selectedRowKeys: origKeys,
                    selectedRows: origRows,
                });

            },
            selectedRowKeys: this.state.selectedRowKeys,
            onSelect: (changableRow, selected, selectedRows) => {
                //state里面记住这两个变量就好
                let origKeys = []
                let origRows = this.state.selectedRows;
                 //去掉数组里面的undefined
                for(var i=0;i<this.state.selectedRowKeys.length;i++){
                    if(typeof(this.state.selectedRowKeys[i])!='undefined'){
                        origKeys.push(this.state.selectedRowKeys[i]);
                    }
                }
                // this.state.selectedRowKeys.filter((item,index )=>{
                //     for(let Litem of this.props.list) {
                //         if(Litem.id!==item) {
                //             return item
                //         }
                //     }
                // })
                if (selected) {
                    origKeys = [...origKeys, changableRow.key];
                    origRows = [...origRows, changableRow];
                } else {
                    origKeys = origKeys.filter((obj) => {
                        return obj !== changableRow.key;
                    });
                    origRows = origRows.filter((obj) => {
                        return obj.key !== changableRow.key;
                    });
                }
            
                this.setState({
                    selectedRowKeys: origKeys,
                    selectedRows: origRows
                });
            }
        }
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return <span>{index + 1}</span>
            }
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Link to={`common-user/${record.relation}`}>{text}</Link>
            }
        }, {
            title: '性别',
            // dataIndex: 'sex',
            // key: 'sex',
            render: (text, record, index) => {
                return <span>{record.sex && record.sex != 'null' ? record.sex : ''}</span>
            }
        }, {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '养殖年限',
            // dataIndex: 'life',
            // key: 'life',
            render: (text, record, index) => {
                return <span>{record.life && record.life != 'undefined' ? record.life : ''}</span>
            }
        }, {
            title: '联系地址',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: '创建时间',
            key: 'createDate',
            dataIndex: 'createDate'
        }, {
            title: '操作',
            dataIndex: 'keyword',
            render: (text, record, index) => {
                return <span>
                    <span > <a href="javascript:void(0);" style={{ marginRight: '15px' }} onClick={() => { this.modifyInfo(record, index) }}>修改</a></span>
                    <Popconfirm title="确认要删除嘛?" onConfirm={() => this.onDelete([record.id + ''])}>
                        <a href="javascript:void(0);">删除</a>
                    </Popconfirm>
                </span>
            }
        },];
        return (
            <PageHeaderLayout>
                <Card bordered={false}>
                    <Row style={{ marginBottom: '48px' }}>
                        <Col>用户名称：<Search style={{ width: 200 }} onSearch={value => this.onSearch(value)} enterButton="查询" /></Col>
                    </Row>
                    <Row style={{ marginBottom: '15px' }}>
                        <Button onClick={()=>this.showAddModal('add')}>新建用户</Button>
                        <Popconfirm title="确认要删除嘛?" onConfirm={() =>this.onDelete(this.state.selectedRowKeys)}>
                        <Button style={{ marginLeft: '10px' }} >删除用户</Button>
                    </Popconfirm>
                    </Row>
                    <Table loading={loading}
                        dataSource={this.props.list}
                        columns={columns}
                        rowSelection={rowSelection}
                        pagination={this.props.pagination}
                        onChange={this.handleTableChange}
                        bordered
                    />
                    <AddUser modifyId={this.state.modifyId} visible={this.state.view} onOk={this.onOk} wrapClassName='vertical-center-modal' onCancel={this.onCancel} />
                </Card>
            </PageHeaderLayout>
        );
    }
}


export default UserList