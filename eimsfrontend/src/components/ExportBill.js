import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast } from 'react-toastify';

const ExportBill = () => {
    // Dependency
    const [dataLoaded, setDataLoaded] = useState(false);

    //API URLs
    const EXPORT_ALL = '/api/export/allByFacility'

    //Data holding objects
    const [exportList, setExportList] = useState([]);

    //Get sent params
    const { state } = useLocation();
    var mess = true;

    // 
    useEffect(() => {
        if (dataLoaded) return;
        loadExportList();
        setDataLoaded(true);
    }, []);

    // Get export list
    const loadExportList = async () => {
        try {
            const result = await axios.get(EXPORT_ALL,
                { params: { facilityId: sessionStorage.getItem("facilityId") } },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: true
                });
            setExportList(result.data);
            // Toast message
            if (mess) {
                toast.success(state);
                mess = false;
            }
        } catch (err) {
            if (!err?.response) {
                toast.error('Server không phản hồi');
            } else {
                if ((err.response.data === null) || (err.response.data === '')) {
                    toast.error('Có lỗi xảy ra, vui lòng thử lại');
                } else {
                    toast.error(err.response.data);
                }
            }
        }
    }

    let navigate = useNavigate();
    const routeChange = (eid) => {
        navigate('/exportbilldetail', { state: { id: eid } });
    }

    return (
        <>
            <nav className="navbar justify-content-between">
                <button className='btn btn-light' onClick={() => navigate("/createexportbill")}>+ Thêm</button>
                <div className='filter my-2 my-lg-0'>
                    <p><FilterAltIcon />Lọc</p>
                    <p><ImportExportIcon />Sắp xếp</p>
                    <form className="form-inline">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <button ><span className="input-group-text" ><SearchIcon /></span></button>
                            </div>
                            <input type="text" className="form-control" placeholder="Tìm kiếm" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                    </form>
                </div>
            </nav>
            <div>
                <section className="u-align-center u-clearfix u-section-1" id="sec-b42b">
                    <div className="u-clearfix u-sheet u-sheet-1">
                        <div className="u-expanded-width u-table u-table-responsive u-table-1">
                            <table className="u-table-entity u-table-entity-1">
                                <colgroup>
                                    <col width="5%" />
                                    <col width="10%" />
                                    <col width="20%" />
                                    <col width="22%" />
                                    <col width="13%" />
                                    <col width="13%" />
                                    <col width="17%" />
                                </colgroup>
                                <thead className="u-palette-4-base u-table-header u-table-header-1">
                                    <tr style={{ height: "21px" }}>
                                        <th className="u-border-1 u-border-custom-color-1 u-palette-2-base u-table-cell u-table-cell-1">STT</th>
                                        <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-2">Mã hoá đơn</th>
                                        <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-3">Khách hàng</th>
                                        <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-4">Ngày bán</th>
                                        <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-5">Tổng (đ)</th>
                                        <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-6">Đã thanh toán (đ)</th>
                                        <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-7">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="u-table-body">

                                    {
                                        exportList && exportList.length > 0 ?
                                            exportList.map((item, index) =>
                                                <tr className='trclick' style={{ height: "76px" }} onClick={() => routeChange(item.exportId)}>
                                                    <td className="u-border-1 u-border-grey-30 u-first-column u-grey-5 u-table-cell u-table-cell-5">{index + 1}</td>
                                                    <td className="u-border-1 u-border-grey-30 u-table-cell">{item.exportId}</td>
                                                    <td className="u-border-1 u-border-grey-30 u-table-cell">{item.customerName}</td>
                                                    <td className="u-border-1 u-border-grey-30 u-table-cell">{item.exportDate.replace("T", " ")}</td>
                                                    <td className="u-border-1 u-border-grey-30 u-table-cell">{item.total.toLocaleString()}</td>
                                                    <td className="u-border-1 u-border-grey-30 u-table-cell">{item.paid.toLocaleString()}</td>
                                                    {
                                                        item.total === item.paid
                                                            ?
                                                            <td className="u-border-1 u-border-grey-30 u-table-cell text-green">
                                                                Đã thanh toán đủ</td>
                                                            :
                                                            <td className="u-border-1 u-border-grey-30 u-table-cell text-red">
                                                                Chưa thanh toán đủ</td>
                                                    }
                                                </tr>
                                            ) :
                                            <tr>
                                                <td colSpan='7'>Chưa có hóa đơn xuất nào được lưu lên hệ thống</td>
                                            </tr>
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
export default ExportBill;