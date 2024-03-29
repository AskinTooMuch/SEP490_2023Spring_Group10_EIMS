import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/machine.css'
import { Modal } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmBox from './ConfirmBox';

function EggBatchDetail(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="span">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

EggBatchDetail.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    // Dependency
    const [eggBatchLoaded, setEggBatchLoaded] = useState(false);

    //URL
    const EGGBATCH_GET = "/api/eggBatch/get";
    const EGGBATCH_UPDATE = "/api/eggBatch/update";
    const EGGBATCH_UPDATE_LOCATION = "/api/eggBatch/update/location";
    const EGGBATCH_UPDATE_DONE = "/api/eggBatch/update/done";

    //ConfirmBox
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    //
    const [phaseName, setPhaseName] = useState("");

    //Get sent params
    const { state } = useLocation();
    const { id } = state;

    //Show-hide Popup
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    // Hanldle show update egg batch
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setUpdateEggBatchDTO({
            eggBatchId: eggBatchDetail.eggBatchId,
            phaseNumber: eggBatchDetail.phaseUpdateList[0].phaseNumber,
            eggWasted: 0,
            amount: 0,
            needAction: eggBatchDetail.needAction,
            eggLocationUpdateEggBatchDTOS: eggBatchDetail.eggProductList
        });
        setShow(false);
        setPhaseName(eggBatchDetail.phaseUpdateList[0].phaseDescription);
    }

    const handleShow = () => {
        if (eggBatchDetail.status === 1 && eggBatchDetail.needAction === 1 && eggBatchDetail.progress < 7) {
            const rows = [...rowsData];
            rows.splice(0, rows.length);

            for (let i = 0; i < eggBatchDetail.machineList.length; i++) {
                rows.splice(i, 0, {
                    machineId: eggBatchDetail.machineList[i].machineId,
                    machineName: eggBatchDetail.machineList[i].machineName,
                    machineTypeId: eggBatchDetail.machineList[i].machineTypeId,
                    amountCurrent: eggBatchDetail.machineList[i].curCapacity,
                    capacity: eggBatchDetail.machineList[i].maxCapacity,
                    amountUpdate: eggBatchDetail.machineList[i].amount,
                    oldAmount: eggBatchDetail.machineList[i].amount
                });
            }
            setRowsData(rows);
            console.log(rows)
            setShow(true);
        } else if (eggBatchDetail.status === 1 && eggBatchDetail.progress >= 7) {
            setShow(true);
        } else if (eggBatchDetail.status === 1 && eggBatchDetail.needAction === 1) {
            const rows = [...rowsData];
            setRowsData(rows);
            setShow(true);
        } else if (eggBatchDetail.status === 0) {
            toast.warning("Lô trứng đã hoàn thành, không thể cập nhật")
        } else if (eggBatchDetail.status === 1 && eggBatchDetail.needAction === 0) {
            toast.warning("Chưa đến giai đoạn cập nhật lô trứng")
        }
    }

    // Hanlde show empty machines
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    // Hanlde show update locations
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => {
        setUpdateLocationDTO({
            eggBatchId: id,
            eggWastedIncubating: 0,
            eggWastedHatching: 0,
            locationsOld: eggBatchDetail.machineList,
            locationsNew: []
        });
        setShow3(false);
    }

    const handleShow3 = () => {
        if (eggBatchDetail.status === 1 && eggBatchDetail.progress < 7) {
            const rows = [...rowsData];
            rows.splice(0, rows.length);

            for (let i = 0; i < eggBatchDetail.machineList.length; i++) {
                rows.splice(i, 0, {
                    machineId: eggBatchDetail.machineList[i].machineId,
                    machineName: eggBatchDetail.machineList[i].machineName,
                    machineTypeId: eggBatchDetail.machineList[i].machineTypeId,
                    amountCurrent: eggBatchDetail.machineList[i].curCapacity,
                    capacity: eggBatchDetail.machineList[i].maxCapacity,
                    amountUpdate: eggBatchDetail.machineList[i].amount,
                    oldAmount: eggBatchDetail.machineList[i].amount
                });
            }
            setRowsData(rows);
            console.log(rows)
            setShow3(true);
        } else if (eggBatchDetail.status === 1 && eggBatchDetail.progress >= 7) {
            setShow3(true);
        } else if (eggBatchDetail.status === 1 && eggBatchDetail.needAction === 1) {
            const rows = [...rowsData];
            setRowsData(rows);
            setShow3(true);
        } else if (eggBatchDetail.status === 0) {
            toast.warning("Lô trứng đã hoàn thành, không thể cập nhật")
        }
    }
    // Handle Change
    const handleChangeData = (index, evnt) => {
        const { name, value } = evnt.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [rowsData, setRowsData] = useState([]);
    // add to machine list
    const addTableRows = (item) => {
        rowsData.splice(rowsData.length, 0, {
            machineId: item.machineId,
            machineName: item.machineName,
            machineTypeId: item.machineTypeId,
            amountCurrent: item.curCapacity,
            capacity: item.maxCapacity,
            amountUpdate: 0,
            oldAmount: 0
        });
        setShow2(false);
    }

    const deleteTableRows = (index) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
    }

    // DTO
    // Egg batch detail
    const [eggBatchDetail, setEggBatchDetail] = useState({
        eggBatchId: id,
        importId: "",
        supplierId: "",
        supplierName: "",
        importDate: "",
        specieId: "",
        specieName: "",
        breedId: "",
        breedName: "",
        startDate: "",
        progressInDays: "",
        incubationPeriod: "",
        amount: "",
        progress: "",
        phase: "",
        needAction: "",
        dateAction: "",
        status: "",
        eggProductList: [],
        machineList: [],
        machineNotFullList: [],
        phaseUpdateList: []
    })

    // Update egg batch
    const [updateEggBatchDTO, setUpdateEggBatchDTO] = useState({
        eggBatchId: id,
        phaseNumber: "",
        eggWasted: 0,
        amount: 0,
        needAction: "",
        eggLocationUpdateEggBatchDTOS: []
    })

    // Update egg batch
    const [updateLocationDTO, setUpdateLocationDTO] = useState({
        eggBatchId: id,
        eggWastedIncubating: 0,
        eggWastedHatching: 0,
        locationsOld: [],
        locationsNew: []
    })

    // Remain egg in updating
    const [remain, setRemain] = useState({
        remain: "",
        remain2: ""
    })

    //Get import details
    useEffect(() => {
        loadEggBatch();
    }, [eggBatchLoaded]);

    const loadEggBatch = async () => {
        const result = await axios.get(EGGBATCH_GET,
            {
                params: { eggBatchId: id },
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                withCredentials: true
            });
        // Set inf
        eggBatchDetail.eggBatchId = result.data.eggBatchId;
        eggBatchDetail.importId = result.data.importId;
        eggBatchDetail.supplierId = result.data.supplierId;
        eggBatchDetail.supplierName = result.data.supplierName;
        eggBatchDetail.importDate = result.data.importDate;
        eggBatchDetail.specieId = result.data.specieId;
        eggBatchDetail.specieName = result.data.specieName;
        eggBatchDetail.breedId = result.data.breedId;
        eggBatchDetail.breedName = result.data.breedName;
        eggBatchDetail.startDate = result.data.startDate;
        eggBatchDetail.progressInDays = result.data.progressInDays;
        eggBatchDetail.incubationPeriod = result.data.incubationPeriod;
        eggBatchDetail.amount = result.data.amount;
        eggBatchDetail.progress = result.data.progress;
        eggBatchDetail.phase = result.data.phase;
        eggBatchDetail.status = result.data.status;
        eggBatchDetail.needAction = result.data.needAction;
        eggBatchDetail.dateAction = result.data.dateAction;
        eggBatchDetail.eggProductList = result.data.eggProductList;
        eggBatchDetail.machineList = result.data.machineList;
        eggBatchDetail.machineNotFullList = result.data.machineNotFullList;
        eggBatchDetail.phaseUpdateList = result.data.phaseUpdateList;

        updateEggBatchDTO.needAction = result.data.needAction;

        updateLocationDTO.locationsOld = result.data.machineList;
        console.log(JSON.stringify(updateLocationDTO.locationsOld));

        if (result.data.phaseUpdateList.length > 0) {
            updateEggBatchDTO.phaseNumber = result.data.phaseUpdateList[0].phaseNumber;
            setPhaseName(result.data.phaseUpdateList[0].phaseDescription);
        } else {
            updateEggBatchDTO.phaseNumber = "phaseNumber";
            setPhaseName("phaseName");
        }

        console.log(JSON.stringify(updateEggBatchDTO));
        if (result.data.progress === 0) {
            remain.remain = result.data.amount;
            remain.remain2 = result.data.amount;
        }
        if (result.data.progress !== 0) {
            remain.remain = eggBatchDetail.eggProductList[2].curAmount + eggBatchDetail.eggProductList[6].curAmount;
            remain.remain2 = eggBatchDetail.eggProductList[2].curAmount + eggBatchDetail.eggProductList[6].curAmount;
        }
        setEggBatchLoaded(true);
    }

    const routeChange = (mid) => {
        navigate('/machinedetail', { state: { id: mid } });
    }

    // display total amount
    function cal() {
        if (eggBatchDetail.progress < 5) {
            if (document.getElementById('remain') !== null) {
                if (eggBatchDetail.eggProductList[8].curAmount === 0) {
                    let a = Number(document.getElementById("eggWasted").value);
                    let b = Number(document.getElementById("amount").value);

                    let sum = remain.remain - (a + b);
                    document.getElementById('remain').innerHTML = sum;
                } else {
                    document.getElementById('remain').innerHTML = "";
                }
            }
        }
        if (eggBatchDetail.progress === 5) {
            if (document.getElementById('remain') !== null) {
                if (eggBatchDetail.eggProductList[8].curAmount === 0) {
                    let a = Number(document.getElementById("eggWasted").value);

                    let sum = remain.remain - a;
                    document.getElementById('remain').innerHTML = sum;
                } else {
                    document.getElementById('remain').innerHTML = "";
                }
            }
        }
    }

    // display total amount
    function cal2() {
        if (eggBatchDetail.progress < 5) {
            if (document.getElementById('remain2') !== null) {
                if (eggBatchDetail.eggProductList[8].curAmount === 0) {
                    let a = Number(document.getElementById("eggWastedIncubating").value);

                    let sum = remain.remain2 - a;
                    document.getElementById('remain2').innerHTML = sum;
                } else {
                    document.getElementById('remain2').innerHTML = "";
                }
            }
        }
        if (eggBatchDetail.progress === 5) {
            if (document.getElementById('remain2') !== null) {
                if (eggBatchDetail.eggProductList[8].curAmount === 0) {
                    let a = Number(document.getElementById("eggWastedIncubating").value);
                    let b = Number(document.getElementById("eggWastedHatching").value);

                    let sum = remain.remain - a - b;
                    document.getElementById('remain2').innerHTML = sum;
                } else {
                    document.getElementById('remain2').innerHTML = "";
                }
            }
        }
    }

    // Variable check done
    function setCheck() {
        var checkBox = document.getElementById("donePhase");
        if (checkBox.checked) {
            updateEggBatchDTO.needAction = 0;
        } else {
            updateEggBatchDTO.needAction = 1;
        }
    }


    //Handle Change functions:
    //Update EggBatch
    const handleUpdateEggBatchChange = (event, field) => {
        let actualValue = event.target.value;
        setUpdateEggBatchDTO({
            ...updateEggBatchDTO,
            [field]: actualValue
        })
        var value;
        var e = document.getElementById("select");
        if (e !== null) {
            value = e.options[e.selectedIndex].value;
        }
        var selectedText = e.options[e.selectedIndex].text;
        if ((field === "amount" && value !== 5) || field === "eggWasted") {
            cal();
        }
        if (field === "phaseNumber") {
            setPhaseName(selectedText);
        }
    }

    //Update location EggBatch
    const handleUpdateLocationChange = (event, field) => {
        let actualValue = event.target.value;
        setUpdateLocationDTO({
            ...updateLocationDTO,
            [field]: actualValue
        })
        if (field === "eggWastedIncubating" || field === "eggWastedHatching") {
            cal2();
        }
    }

    // Handle Submit functions
    const handleUpdateEggBatchSubmit = async (event) => {
        setOpen(false);
        event.preventDefault();
        console.log(rowsData)
        updateEggBatchDTO.eggBatchId = id;
        updateEggBatchDTO.eggLocationUpdateEggBatchDTOS = rowsData;
        console.log(JSON.stringify(updateEggBatchDTO))
        let response;
        try {
            response = await axios.put(EGGBATCH_UPDATE,
                updateEggBatchDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: true
                }
            );
            setShow(false);
            setUpdateEggBatchDTO({
                eggBatchId: id,
                phaseNumber: "",
                eggWasted: "",
                amount: "",
                eggLocationUpdateEggBatchDTOS: [],
                done: true
            });
            setRowsData([]);
            loadEggBatch();
            setEggBatchLoaded(false);
            toast.success("Cập nhật lô trứng thành công");
        } catch (err) {
            if (!err?.response) {
                toast.error('Server không phản hồi');
            } else {
                if ((err.response.data === null) || (err.response.data === '')) {
                    toast.error('Có lỗi xảy ra, vui lòng thử lại');
                } else {
                    toast.error(err.response.data);
                }
                console.log(err.response.data);
            }
        }
    }

    // Update location
    const handleUpdateLocationSubmit = async (event) => {
        setOpen3(false);
        event.preventDefault();
        console.log(rowsData);
        updateLocationDTO.locationsOld = eggBatchDetail.machineList;
        updateLocationDTO.locationsNew = rowsData;
        console.log(JSON.stringify(updateLocationDTO))
        let response;
        try {
            const response = await axios.put(EGGBATCH_UPDATE_LOCATION,
                updateLocationDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: true
                }
            );
            setShow3(false);
            setUpdateLocationDTO({
                eggBatchId: id,
                eggWasted: 0,
                locationsOld: [],
                locationsNew: []
            });
            setRowsData([]);
            loadEggBatch();
            setEggBatchLoaded(false);
            toast.success("Cập nhật lô trứng thành công");
        } catch (err) {
            if (!err?.response) {
                toast.error('Server không phản hồi');
            } else {
                if ((err.response.data === null) || (err.response.data === '')) {
                    toast.error('Có lỗi xảy ra, vui lòng thử lại');
                } else {
                    toast.error(err.response.data);
                }
                console.log(err.response.data);
            }
        }
    }

    // Handle Update done 
    const handleUpdateEggBatchDone = async () => {
        setOpen2(false);
        let response;
        try {
            response = await axios.put(EGGBATCH_UPDATE_DONE, {},
                {
                    params: {
                        "eggBatchId": eggBatchDetail.eggBatchId,
                        "done": true
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: true
                }
            );
            setShow(false);
            loadEggBatch();
            setEggBatchLoaded(false);
            toast.success("Đã hoàn thành lô trứng");
        } catch (err) {
            if (!err?.response) {
                toast.error('Server không phản hồi');
            } else {
                if ((err.response.data === null) || (err.response.data === '')) {
                    toast.error('Có lỗi xảy ra, vui lòng thử lại');
                } else {
                    toast.error(err.response.data);
                }
                console.log(err.response.data);
            }
        }
    }

    return (

        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'black' }}>
                <Tabs sx={{
                    '& .MuiTabs-indicator': { backgroundColor: "#d25d19" },
                    '& .Mui-selected': { color: "#d25d19" },
                }} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{ textTransform: "capitalize" }} label="Lô Trứng" {...a11yProps(0)} />
                    <Tab style={{ textTransform: "capitalize" }} label="Trở về trang Trứng" {...a11yProps(1)} onClick={() => navigate("/egg")} />
                </Tabs>
            </Box>
            <EggBatchDetail value={value} index={0}>
                <div className='container'>
                    <h3 style={{ textAlign: "center" }}>Thông tin lô trứng</h3>
                    <div className='detailbody'>
                        <div className="row">
                            <div className="col-md-3">
                                <p>Mã lô</p>
                            </div>
                            <div className="col-md-3">
                                <p>{eggBatchDetail.eggBatchId}</p>
                            </div>
                            <div className="col-md-3 ">
                                <p>Mã hoá đơn</p>
                            </div>
                            <div className="col-md-3">
                                <p>{eggBatchDetail.importId}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <p>Nhà cung cấp</p>
                            </div>
                            <div className="col-md-3">
                                <p>{eggBatchDetail.supplierName}</p>
                            </div>
                            <div className="col-md-3 ">
                                <p>Ngày nhập</p>
                            </div>
                            <div className="col-md-3">
                                <p>{eggBatchDetail.importDate.replace("T", " ")}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <p>Tên loài</p>
                            </div>
                            <div className="col-md-3">
                                <p>{eggBatchDetail.specieName}</p>
                            </div>
                            {
                                eggBatchDetail.startDate !== null
                                    ? <>
                                        <div className="col-md-3 ">
                                            <p>Thời gian bắt đầu ấp</p>
                                        </div>
                                        <div className="col-md-3">
                                            <p>{eggBatchDetail.startDate.replace("T", " ")}</p>
                                        </div>
                                    </>
                                    : ''
                            }


                        </div>
                        <div className="row">
                            <div className="col-md-3 ">
                                <p>Tên loại</p>
                            </div>
                            <div className="col-md-3">
                                <p>{eggBatchDetail.breedName}</p>
                            </div>
                            {
                                eggBatchDetail.progress !== 0
                                    ?
                                    <>
                                        <div className="col-md-3 ">
                                            <p>Ngày dự tính giai đoạn tiếp theo</p>
                                        </div>
                                        <div className="col-md-3">
                                            <p>{eggBatchDetail.dateAction.slice(0, 10)}</p>
                                        </div>
                                    </>
                                    : ''
                            }

                        </div>
                        <div className="row">

                            <div className="col-md-3">
                                <p>Số lượng</p>
                            </div>
                            <div className="col-md-3">
                                <p>{eggBatchDetail.amount.toLocaleString()}</p>
                            </div>
                            <div className="col-md-3 ">
                                <p></p>
                            </div>
                            <div className="col-md-3">
                                <p></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <p>Giai đoạn hiện tại:  </p>
                            </div>
                            <div className="col-md-3">
                                <p>({eggBatchDetail.progress}){eggBatchDetail.phase}
                                </p>
                            </div>
                            <div className="col-md-3">
                            </div>
                            <div className="col-md-3">
                                {
                                    eggBatchDetail.status === 0
                                        ? <td className=''>Đã hoàn thành</td>
                                        : ''
                                }
                                {
                                    eggBatchDetail.status === 1 && eggBatchDetail.needAction === 1 && eggBatchDetail.progress < 5
                                        ? <td className='text-red'>Cần cập nhật</td>
                                        : ''
                                }
                                {
                                    eggBatchDetail.status === 1 && eggBatchDetail.needAction === 0 && eggBatchDetail.progress < 5
                                        ? <td className='text-green'>Đang ấp</td>
                                        : ''
                                }
                                {
                                    eggBatchDetail.status === 1 && eggBatchDetail.needAction === 0 && eggBatchDetail.progress === 5
                                        ? <td className='text-green'>Đang nở</td>
                                        : ''
                                }
                                {
                                    eggBatchDetail.status === 1 && eggBatchDetail.needAction === 1 && eggBatchDetail.progress === 5
                                        ? <td className='text-red'>Cần cập nhật</td>
                                        : ''
                                }
                                {
                                    eggBatchDetail.status === 1 && eggBatchDetail.progress > 5
                                        ? <td className='text-green'>Đã nở</td>
                                        : ''
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <p></p>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Giai đoạn</th>
                                <th scope="col" width="8%"></th>
                                <th scope="col" width="8%">0</th>
                                <th scope="col" width="8%">1</th>
                                <th scope="col" width="8%">2</th>
                                <th scope="col" width="8%">3</th>
                                <th scope="col" width="8%">4</th>
                                <th scope="col" width="8%">5</th>
                                <th scope="col" width="8%">6</th>
                                <th scope="col" width="8%">7</th>
                                <th scope="col" width="8%">8</th>
                                <th scope="col" width="8%">9</th>
                            </tr>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col" width="8%">Hao hụt</th>
                                <th scope="col" width="8%">Trứng dập</th>
                                <th scope="col" width="8%">Trứng đang ấp</th>
                                <th scope="col" width="8%">Trứng trắng </th>
                                <th scope="col" width="8%">Trứng loãng</th>
                                <th scope="col" width="8%">Trứng lộn</th>
                                <th scope="col" width="8%">Trứng đang nở</th>
                                <th scope="col" width="8%">Trứng tắc</th>
                                <th scope="col" width="8%">Con nở</th>
                                <th scope="col" width="8%">Con đực</th>
                                <th scope="col" width="8%">Con cái</th>
                            </tr>
                        </thead>

                        {
                            eggBatchDetail.eggProductList && eggBatchDetail.eggProductList.length > 0 ?
                                <tbody>
                                    <tr>
                                        <th scope="row">Ban đầu</th>
                                        <td>{eggBatchDetail.eggProductList[0].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[1].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[2].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[3].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[4].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[5].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[6].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[7].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[8].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[9].amount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[10].amount.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Hiện tại</th>
                                        <td>{eggBatchDetail.eggProductList[0].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[1].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[2].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[3].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[4].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[5].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[6].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[7].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[8].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[9].curAmount.toLocaleString()}</td>
                                        <td>{eggBatchDetail.eggProductList[10].curAmount.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                                : <tbody>
                                    <tr>
                                        <th scope="row">Ban đầu</th>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Hiện tại</th>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                    </tr>
                                </tbody>
                        }

                    </table>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Vị trí</th>
                                <th scope="col">Loại</th>
                                <th scope="col">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                eggBatchDetail.machineList && eggBatchDetail.machineList.length > 0 ?
                                    eggBatchDetail.machineList.map((item, index) =>
                                        <tr className='trclick' style={{ height: "76px", textAlign: "center" }} onClick={() => routeChange(item.machineId)}>
                                            <th scope="row">{item.machineName}</th>
                                            {
                                                item.machineTypeId === 1
                                                    ?
                                                    <td>Máy ấp</td>
                                                    :
                                                    <td>Máy nở</td>
                                            }
                                            <td>{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ) : ''
                            }
                        </tbody>
                    </table>
                </div>
                <div style={{ textAlign: "center" }}>
                    {
                        eggBatchDetail.progress && eggBatchDetail.progress <= 5 && eggBatchDetail.status === 1
                            ?
                            <button style={{ margin: "0 20px", width: "180px" }} className='btn btn-light' id="startUpdateLocationEggBatch" onClick={handleShow3}>Cập nhật vị trí</button>
                            :
                            ''
                    }
                    {
                        eggBatchDetail.status && eggBatchDetail.status === 1 && eggBatchDetail.needAction === 1
                            ?
                            <button style={{ width: "180px" }} className='btn btn-light' id="startUpdateEggBatch" onClick={handleShow}>Cập nhật giai đoạn</button>
                            : ''
                    }

                    <Modal show={show} onHide={handleClose}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        dialogClassName="modal-90w">
                        <form >
                            <Modal.Header closeButton onClick={handleClose}>
                                <Modal.Title>Cập nhật Thông tin lô trứng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='container'>
                                    <div className='detailbody'>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-3" >
                                                <label>Giai đoạn hiện tại: </label>
                                            </div>
                                            {
                                                eggBatchDetail.progress === 0
                                                    ?
                                                    <div className="col-md-3">
                                                        <label>{eggBatchDetail.phase}</label>
                                                    </div>
                                                    :
                                                    <div className="col-md-3">
                                                        <label>({eggBatchDetail.progress}) {eggBatchDetail.phase}</label>
                                                    </div>
                                            }

                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-3" >
                                                <label>Số lượng hao hụt: </label>
                                            </div>
                                            <div className="col-md-3">
                                                <input defaultValue="0" className='form-control' id="eggWasted" name="eggWasted" type="number"
                                                    onChange={(e) => handleUpdateEggBatchChange(e, "eggWasted")} />
                                            </div>
                                            {
                                                eggBatchDetail.eggProductList && eggBatchDetail.eggProductList.length > 0
                                                    && eggBatchDetail.progress > 0
                                                    && eggBatchDetail.eggProductList[2].curAmount !== 0
                                                    ? <>
                                                        <div className="col-md-3" >
                                                            <label>Số trứng đang ấp: </label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <input disabled className='form-control'
                                                                value={eggBatchDetail.eggProductList[2].curAmount.toLocaleString()} />
                                                        </div>
                                                    </>
                                                    : ''
                                            }
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-3 ">
                                                <label>Loại cập nhật</label>
                                            </div>
                                            <div className="col-md-3">
                                                <select onChange={(e) => handleUpdateEggBatchChange(e, "phaseNumber")} id="select" className="form-select" aria-label="Default select example">
                                                    {
                                                        eggBatchDetail.phaseUpdateList && eggBatchDetail.phaseUpdateList.length > 0
                                                            ? eggBatchDetail.phaseUpdateList.map((item) =>
                                                                <option value={item.phaseNumber}>{item.phaseDescription}</option>
                                                            )
                                                            : ''
                                                    }
                                                </select>
                                            </div>
                                            {
                                                eggBatchDetail.eggProductList && eggBatchDetail.eggProductList.length > 0
                                                    && eggBatchDetail.progress === 5
                                                    && eggBatchDetail.eggProductList[6].curAmount !== 0
                                                    ? <>
                                                        <div className="col-md-3" >
                                                            <label>Số trứng đang nở: </label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <input disabled className='form-control'
                                                                value={eggBatchDetail.eggProductList[6].curAmount.toLocaleString()} />
                                                        </div>
                                                    </>
                                                    : ''
                                            }
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-3" >
                                                <label>Số lượng cập nhật</label>
                                            </div>
                                            <div className="col-md-3">
                                                <input defaultValue="0" className='form-control' id="amount" name="amount" type="number"
                                                    onChange={(e) => handleUpdateEggBatchChange(e, "amount")} />
                                            </div>

                                            {
                                                eggBatchDetail.progress === 0
                                                    || (eggBatchDetail.progress < 5)
                                                    ?
                                                    <>
                                                        <div className="col-md-3 ">
                                                            <label>Số lượng trứng còn lại</label><br/>
                                                            (tổng trứng trong máy ấp)
                                                        </div>
                                                        <div className="col-md-3">
                                                            <p className='form-control' id="remain" name="remain">{remain.remain.toLocaleString()}</p>
                                                        </div>
                                                    </>
                                                    : ''
                                            }
                                            {
                                                eggBatchDetail.progress === 5 && eggBatchDetail.eggProductList[2].curAmount > 0
                                                    ?
                                                    <>
                                                        <div className="col-md-3 ">
                                                            <label>Số lượng trứng còn lại</label><br/>
                                                            (tổng trứng trong máy)
                                                        </div>
                                                        <div className="col-md-3">
                                                            <p className='form-control' id="remain" name="remain">{remain.remain.toLocaleString()}</p>
                                                        </div>
                                                    </>
                                                    : ''
                                            }
                                            {
                                                eggBatchDetail.progress >= 7
                                                    ?
                                                    <>
                                                        <div className="col-md-3 ">
                                                            <label>Số lượng con nở</label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <p className='form-control' id="" name="">{eggBatchDetail.eggProductList[8].curAmount}</p>
                                                        </div>
                                                    </>
                                                    : ''
                                            }
                                            <br />
                                            {
                                                (eggBatchDetail.progress === 0 || eggBatchDetail.progress > 4
                                                    || (eggBatchDetail.progress === 4 && eggBatchDetail.phaseUpdateList[0].phaseNumber === 5)
                                                )
                                                    ? ''
                                                    :
                                                    <div className='row'>
                                                        <div className="col-md-3" >
                                                            <label for="donePhase">Xác nhận hoàn thành giai đoạn</label>
                                                        </div>
                                                        <div className="col-md-3" >
                                                            <input type="checkbox" id="donePhase" name="donePhase" onClick={() => setCheck()} />
                                                        </div>
                                                    </div>
                                            }

                                        </div>
                                    </div>
                                    <ConfirmBox open={open} closeDialog={() => setOpen(false)} title={"Xác nhận cập nhật lô trứng"}
                                        content={"Xác nhận cập nhật lô trứng với mã " + eggBatchDetail.eggBatchId
                                            + ": cập nhật giai đoạn " + updateEggBatchDTO.phaseNumber + " (" + phaseName + ")"
                                            + ", số lượng cập nhật: " + updateEggBatchDTO.amount
                                            + ", số lượng trứng hao hụt: " + updateEggBatchDTO.eggWasted}
                                        deleteFunction={(e) => handleUpdateEggBatchSubmit(e)}
                                    />
                                    <ConfirmBox open={open2} closeDialog={() => setOpen2(false)} title={"Xác nhận hoàn thành lô trứng"}
                                        content={"Xác nhận hoàn thành lô trứng với mã " + eggBatchDetail.eggBatchId}
                                        deleteFunction={(e) => handleUpdateEggBatchDone(e)}
                                    />
                                    <br />
                                    {
                                        eggBatchDetail.progress && eggBatchDetail.progress >= 7
                                            ? ''
                                            :
                                            <div className='clear'>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Máy</th>
                                                            <th scope="col">Loại</th>
                                                            <th scope="col">Chứa</th>
                                                            <th scope="col">Vị trí trống</th>
                                                            <th scope="col">Số trứng hiện tại</th>
                                                            <th scope="col">Số trứng cập nhật</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChangeData={handleChangeData} />
                                                    </tbody>
                                                </table>
                                                <div style={{ textAlign: "center" }}>
                                                    <button className="btn btn-light" type='button' onClick={handleShow2} >+</button>
                                                </div>
                                            </div>
                                    }

                                    <div style={{ textAlign: "center" }}>
                                        <Modal show={show2} onHide={handleClose2}
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered >
                                            <Modal.Header closeButton onClick={handleClose2}>
                                                <Modal.Title>Những máy còn trống</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="table-wrapper-scroll-y my-custom-scrollbar">
                                                    <table style={{ overflowY: "scroll" }} className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Máy</th>
                                                                <th scope="col">Loại</th>
                                                                <th scope="col">Chứa</th>
                                                                <th scope="col">Vị trí trống</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody >
                                                            {
                                                                eggBatchDetail.machineNotFullList && eggBatchDetail.machineNotFullList.length > 0 ?
                                                                    eggBatchDetail.machineNotFullList.map((item, index) =>
                                                                        <tr className='trclick' onClick={() => addTableRows(item)}>
                                                                            <td>{item.machineName}</td>
                                                                            <td>{item.machineTypeName}</td>
                                                                            <td>{item.curCapacity.toLocaleString()}/{item.maxCapacity.toLocaleString()}</td>
                                                                            <td>{(item.maxCapacity - item.curCapacity).toLocaleString()}</td>
                                                                        </tr>
                                                                    ) : 'Hiện tại không có máy nào còn trống'
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                            </Modal.Body>
                            <div className='model-footer'>
                                <button style={{ width: "20%" }} onClick={() => setOpen(true)}
                                    className="col-md-6 btn-light" type="button">
                                    Lưu
                                </button>
                                <button style={{ width: "10%" }} onClick={handleClose} type='button' className="btn btn-light">
                                    Huỷ
                                </button>
                                {
                                    eggBatchDetail.progress && eggBatchDetail.progress >= 7 ?
                                        <button style={{ width: "20%", float: "left" }} onClick={() => setOpen2(true)} className="col-md-6 btn-light" type="button">
                                            Hoàn thành lô
                                        </button>
                                        : ''
                                }

                            </div>
                        </form>
                    </Modal>

                    <Modal show={show3} onHide={handleClose3}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        dialogClassName="modal-90w">
                        <form >
                            <Modal.Header closeButton onClick={handleClose3}>
                                <Modal.Title>Cập nhật vị trí lô trứng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='container'>
                                    <div className='detailbody'>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-3" >
                                                <label>Giai đoạn hiện tại: </label>
                                            </div>
                                            {
                                                eggBatchDetail.progress === 0
                                                    ?
                                                    <div className="col-md-3">
                                                        <label>{eggBatchDetail.phase}</label>
                                                    </div>
                                                    :
                                                    <div className="col-md-3">
                                                        <label>({eggBatchDetail.progress}) {eggBatchDetail.phase}</label>
                                                    </div>
                                            }

                                        </div>
                                        <br />
                                        {
                                            eggBatchDetail.eggProductList && eggBatchDetail.eggProductList.length > 0
                                                && eggBatchDetail.eggProductList[2].curAmount !== 0
                                                ?
                                                <div className="row">
                                                    <div className="col-md-3" >
                                                        <label>Trứng hao hụt (Trứng đang ấp):</label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input defaultValue="0" className='form-control' id="eggWastedIncubating" name="eggWastedIncubating" type="number"
                                                            onChange={(e) => handleUpdateLocationChange(e, "eggWastedIncubating")} />
                                                    </div>
                                                    <div className="col-md-3" >
                                                        <label>Số trứng đang ấp: </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input disabled className='form-control'
                                                            value={eggBatchDetail.eggProductList[2].curAmount.toLocaleString()} />
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                        <br />

                                        {
                                            eggBatchDetail.eggProductList && eggBatchDetail.eggProductList.length > 0
                                                && eggBatchDetail.eggProductList[6].curAmount !== 0
                                                ?
                                                <div className="row">
                                                    <div className="col-md-3" >
                                                        <label>Trứng hao hụt (Trứng đang nở):</label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input defaultValue="0" className='form-control' id="eggWastedHatching" name="eggWastedHatching" type="number"
                                                            onChange={(e) => handleUpdateLocationChange(e, "eggWastedHatching")} />
                                                    </div>
                                                    <div className="col-md-3" >
                                                        <label>Số trứng đang nở: </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input disabled className='form-control'
                                                            value={eggBatchDetail.eggProductList[6].curAmount.toLocaleString()} />
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                        <br />
                                        <div className="row">
                                            <div className="col-md-3" >
                                                <label></label>
                                            </div>
                                            <div className="col-md-3">
                                            </div>
                                            {
                                                eggBatchDetail.progress === 0
                                                    || (eggBatchDetail.progress <= 5)
                                                    ?
                                                    <>
                                                        <div className="col-md-3 ">
                                                            <label>Số lượng trứng còn lại</label><br/>
                                                            (tổng trứng trong máy)
                                                        </div>
                                                        <div className="col-md-3">
                                                            <p className='form-control' id="remain2" name="remain2">{remain.remain2.toLocaleString()}</p>
                                                        </div>
                                                    </>
                                                    : ''
                                            }
                                            {
                                                eggBatchDetail.progress >= 7
                                                    ?
                                                    <>
                                                        <div className="col-md-3 ">
                                                            <label>Số lượng con nở</label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <p className='form-control' id="" name="">{eggBatchDetail.eggProductList[8].curAmount}</p>
                                                        </div>
                                                    </>
                                                    : ''
                                            }
                                            <br />
                                        </div>
                                    </div>
                                    <ConfirmBox open={open3} closeDialog={() => setOpen3(false)} title={"Xác nhận cập nhật vị trí lô trứng"}
                                        content={"Xác nhận cập nhật vị trí lô trứng với mã " + eggBatchDetail.eggBatchId}
                                        deleteFunction={(e) => handleUpdateLocationSubmit(e)}
                                    />
                                    <br />
                                    {
                                        eggBatchDetail.progress && eggBatchDetail.progress >= 7
                                            ? ''
                                            :
                                            <div className='clear'>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Máy</th>
                                                            <th scope="col">Chứa</th>
                                                            <th scope="col">Vị trí trống</th>
                                                            <th scope="col">Số trứng hiện tại</th>
                                                            <th scope="col">Số trứng cập nhật</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChangeData={handleChangeData} />
                                                    </tbody>
                                                </table>
                                                <div style={{ textAlign: "center" }}>
                                                    <button className="btn btn-light" type='button' onClick={handleShow2} >+</button>
                                                </div>
                                            </div>
                                    }

                                    <div style={{ textAlign: "center" }}>
                                        <Modal show={show2} onHide={handleClose2}
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered >
                                            <Modal.Header closeButton onClick={handleClose2}>
                                                <Modal.Title>Những máy còn trống</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="table-wrapper-scroll-y my-custom-scrollbar">
                                                    <table style={{ overflowY: "scroll" }} className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Máy</th>
                                                                <th scope="col">Loại</th>
                                                                <th scope="col">Chứa</th>
                                                                <th scope="col">Vị trí trống</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody >
                                                            {
                                                                eggBatchDetail.machineNotFullList && eggBatchDetail.machineNotFullList.length > 0 ?
                                                                    eggBatchDetail.machineNotFullList.map((item, index) =>
                                                                        <tr className='trclick' onClick={() => addTableRows(item)}>
                                                                            <td>{item.machineName}</td>
                                                                            <td>{item.machineTypeName}</td>
                                                                            <td>{item.curCapacity.toLocaleString()}/{item.maxCapacity.toLocaleString()}</td>
                                                                            <td>{(item.maxCapacity - item.curCapacity).toLocaleString()}</td>
                                                                        </tr>
                                                                    ) : 'Hiện tại không có máy nào còn trống'
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                            </Modal.Body>
                            <div className='model-footer'>
                                <button style={{ width: "20%" }} onClick={() => setOpen3(true)}
                                    className="col-md-6 btn-light" type="button">
                                    Lưu
                                </button>
                                <button style={{ width: "10%" }} onClick={handleClose3} type='button' className="btn btn-light">
                                    Huỷ
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </EggBatchDetail>
        </Box>
    );
}

function TableRows({ rowsData, deleteTableRows, handleChangeData }) {
    return (
        rowsData.map((data, index) => {
            const { machineName, machineTypeId, amountCurrent, capacity, amountUpdate, oldAmount } = data;
            return (
                <tr key={index}>
                    <td>
                        <div name="machineName" className="form-control" >
                            {machineName}
                        </div>
                    </td>
                    {
                        machineTypeId === 1
                            ?
                            <td>
                                <div name="machineTypeName" className="form-control" >
                                    Máy ấp
                                </div>
                            </td>
                            :
                            <td>
                                <div name="machineTypeName" className="form-control" >
                                    Máy nở
                                </div>
                            </td>
                    }

                    <td>
                        <div name="current" className="form-control" >
                            {amountCurrent.toLocaleString()} / {capacity.toLocaleString()}
                        </div>
                    </td>
                    <td>
                        <div name="emptySlot" className="form-control" >
                            {(capacity - amountCurrent).toLocaleString()}
                        </div>
                    </td>
                    <td>
                        <div name="oldAmount" className="form-control" >
                            {oldAmount.toLocaleString()}
                        </div>
                    </td>
                    <td><input type="number" value={amountUpdate} onChange={(evnt) => (handleChangeData(index, evnt))} name="amountUpdate" className="form-control" /> </td>
                    {
                        (oldAmount > 0)
                            ? <td className='td'><button disabled className="btn btn-outline-danger" type='button' onClick={() => (deleteTableRows(index))}><ClearIcon /></button></td>
                            : <td className='td'><button className="btn btn-outline-danger" type='button' onClick={() => (deleteTableRows(index))}><ClearIcon /></button></td>
                    }
                </tr>
            )
        })
    )
}