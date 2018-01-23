
import { Button, Toast } from 'antd-mobile';
import NavBar from '../../components/NavBar';
import { withRouter } from "react-router-dom";
import { connect } from 'dva';
import './addEquipment.less';
import scan from '../../img/scan_QR.png'
import { addEquipment } from '../../services/equipment.js'; //接口

class AddEquipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            equipmentCode: ''
        }
    }
    scanEquipment = () => {
        console.log('scan');
        wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            console.log(result);
            this.setState({equipmentCode: result});
        }
        });
    }

    doAddEquipment = () => {
        if (!this.state.equipmentCode) {
            Toast.info('请输入设备编号!', 1);
            return;
        }
        this.props.dispatch({
            type: 'global/changeState',
            payload: {
                transitionName: 'left'
            }
        })
        this.props.history.push(`/addEquipmentDetail/${this.state.equipmentCode}`);

    }

    render() {
        return (<div className='addEqu_bg' >
            <NavBar
                title='添加设备'
            />
            <div className='add-line'>
                <input
                    placeholder='请输入设备编号'
                    value={this.state.equipmentCode}
                    onChange={e => this.setState({
                        equipmentCode: e.target.value.replace(/ /g, '')
                    })}
                />
                <div onClick={this.doAddEquipment}>添加</div>
            </div>
            <div className='scan-block' onClick={this.scanEquipment}>
                <img src={scan} />
                <p>扫描设备条码添加</p>
            </div>
        </div>)
    }
}

export default connect()(AddEquipment);
