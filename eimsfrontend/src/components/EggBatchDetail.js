import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/machine.css'
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from 'react-bootstrap'
import chicpic from '../pics/gari.png'
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
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (

        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'black' }}>
                <Tabs sx={{
                    '& .MuiTabs-indicator': { backgroundColor: "#d25d19" },
                    '& .Mui-selected': { color: "#d25d19" },
                }} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{ textTransform: "capitalize" }} label="L?? Tr???ng" {...a11yProps(0)} />
                    <Tab style={{ textTransform: "capitalize" }} label="Tr??? v??? trang Tr???ng" {...a11yProps(1)} onClick={() => navigate("/egg")} />
                </Tabs>
            </Box>
            <EggBatchDetail value={value} index={0}>
                <div className='container'>
                    <h3 style={{ textAlign: "center" }}>Tr???ng g?? ri</h3>
                    <div className='detailbody'>

                        <div className="row">
                            <div className="col-md-3">
                                <p>M?? l??</p>
                            </div>
                            <div className="col-md-3">
                                <p>GFJ816</p>
                            </div>
                            <div className="col-md-3 ">
                                <p>M?? ho?? ????n</p>
                            </div>
                            <div className="col-md-3">
                                <p>HDJ71-71-25</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <p>Nh?? cung c???p</p>
                            </div>
                            <div className="col-md-3">
                                <p>Ph???m Anh B</p>
                            </div>
                            <div className="col-md-3 ">
                                <p>Ng??y nh???p</p>
                            </div>
                            <div className="col-md-3">
                                <p>2401/2023</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <p>T??n lo??i</p>
                            </div>
                            <div className="col-md-3">
                                <p>G??</p>
                            </div>
                            <div className="col-md-3 ">
                                <p>T??n lo???i</p>
                            </div>
                            <div className="col-md-3">
                                <p>G?? ri</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <p>S??? l?????ng</p>
                            </div>
                            <div className="col-md-3">
                                <p>3000 qu???</p>
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
                                <p>Giai ??o???n hi???n t???i</p>
                            </div>
                            <div className="col-md-3">
                                <p>2</p>
                            </div>
                            <div className="col-md-3 ">
                                <p>Tr???ng th??i</p>
                            </div>
                            <div className="col-md-3">
                                <p className='text-blue'>??ang ???p</p>
                            </div>
                        </div>
                        <div>Th??ng b??o c???n chi???u tr???ng</div>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Tr???ng v???</th>
                                <th scope="col">Tr???ng tr???ng</th>
                                <th scope="col">Tr???ng lo??ng</th>
                                <th scope="col">Tr???ng t???c</th>
                                <th scope="col">Con</th>
                                <th scope="col">Con ?????c</th>
                                <th scope="col">Con c??i</th>
                                <th scope="col">Hao h???t</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Ban ?????u</th>
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
                                <th scope="row">Hi???n t???i</th>
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
                    </table>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">V??? tr??</th>
                                <th scope="col">S??? l?????ng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">M??y 13</th>
                                <td>1000</td>
                            </tr>
                            <tr>
                                <th scope="row">M??y 17</th>
                                <td>1000</td>
                            </tr>
                            <tr>
                                <th scope="row">M??y 23</th>
                                <td>500</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <button className='btn btn-success' style={{ width: "20%", float: "right" }} id="startUpdateEggBatch">C???p nh???t</button>
            </EggBatchDetail>


        </Box>

    );
}