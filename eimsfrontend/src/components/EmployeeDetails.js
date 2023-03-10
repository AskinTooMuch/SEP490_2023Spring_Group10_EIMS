import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/machine.css'
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from 'react-bootstrap'
function EmployeeDetails(props) {
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
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

EmployeeDetails.propTypes = {
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
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();
    return (

        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'black' }}>
                <Tabs sx={{
                    '& .MuiTabs-indicator': { backgroundColor: "#d25d19" },
                    '& .Mui-selected': { color: "#d25d19" },
                }} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{ textTransform: "capitalize" }} label="Nh??n vi??n" {...a11yProps(0)} />
                    <Tab style={{ textTransform: "capitalize" }} label="Tr??? v??? trang Nh??n vi??n chung" {...a11yProps(1)} onClick={() => navigate("/employee")} />
                </Tabs>
            </Box>
            <EmployeeDetails value={value} index={0}>
                <div className='container'>
                    <h3 style={{ textAlign: "center" }}>Th??ng tin nh??n vi??n</h3>
                    <Modal show={show} onHide={handleClose}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered >
                        <form>
                            <Modal.Header closeButton onClick={handleClose}>
                                <Modal.Title>C???p nh???t th??ng tin nh??n vi??n</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="">
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <p>H??? v?? t??n<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <input style={{ width: "100%" }} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>S??? ??i???n tho???i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <input style={{ width: "100%" }} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>?????a ch???</p>
                                        </div>
                                        <div className="col-md-6">
                                            <textarea style={{ width: "100%" }} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>Email</p>
                                        </div>
                                        <div className="col-md-6">
                                            <input style={{ width: "100%" }} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>Ti???n l????ng<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <input style={{ width: "100%" }} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>Tr???ng th??i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <select className="form-select" aria-label="Default select example">
                                                <option selected>Ch???n tr???ng th??i ho???t ?????ng</option>
                                                <option value="1" className='text-green'>??ang ho???t ?????ng </option>
                                                <option value="2" className='text-red'>Ngh??? vi???c</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </Modal.Body>
                            <div className='model-footer'>
                                <button style={{ width: "30%" }} className="col-md-6 btn-light" onClick={handleClose}>
                                    C???p nh???t
                                </button>
                                <button style={{ width: "20%" }} onClick={handleClose} className="btn btn-light">
                                    Hu???
                                </button>
                            </div>
                        </form>
                    </Modal>
                    <div className='detailbody'>
                        <div className="row">
                            <div className="col-md-4">
                                <p>H??? v?? t??n</p>
                            </div>
                            <div className="col-md-4">
                                <p>Nguy???n Ho??ng D????ng</p>
                            </div>
                            <div className="col-md-4 ">
                                <div className='button'>
                                    <button className='btn btn-light ' onClick={handleShow}>S???a</button>
                                    <button className='btn btn-light '>Xo??</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>S??? ??i???n tho???i</p>
                            </div>
                            <div className="col-md-4">
                                <p>09124719471</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>?????a ch???</p>
                            </div>
                            <div className="col-md-4">
                                <p>H?? N???i</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>Email</p>
                            </div>
                            <div className="col-md-4">
                                <p>abc@gmail.com</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>Ti???n l????ng</p>
                            </div>
                            <div className="col-md-4">
                                <p>5.000.000 VN??/th??ng</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>Tr???ng th??i</p>
                            </div>
                            <div className="col-md-4">
                                <p className="text-green">Ho???t ?????ng </p>
                            </div>
                        </div>
                    </div>

                </div>
            </EmployeeDetails>
        </Box>

    );
}