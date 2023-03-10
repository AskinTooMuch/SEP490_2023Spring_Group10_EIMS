import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faCheck, faTimes, faInfoCircle, faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "../css/profile.css"
import { Modal, Button } from 'react-bootstrap'
const eye = <FontAwesomeIcon icon={faEye} />;
//regex check password
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const Profile = () => {
    //api url
    const CHANGE_PASS_URL = '/api/auth/changePassword';
    const USER_DETAIL_URL = '/api/user/details';
    const USER_UPDATE_GET = '/api/user/update/get';
    const USER_UPDATE_SAVE = '/api/user/update/save';
    const FACILITY_UPDATE_GET = 'api/facility/update/get';
    const FACILITY_UPDATE_SAVE = 'api/facility/update/save';


    // Dependency
    const [addressLoaded, setAddressLoaded] = useState(false);
    const [userDetailLoaded, setUserDetailLoaded] = useState(false);
    const [addressJson, setAddressJson] = useState({
        city: "",
        district: "",
        ward: "",
        street: ""
    });

    //show-hide password 
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShown2, setPasswordShown2] = useState(false);
    const [passwordShown3, setPasswordShown3] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const togglePasswordVisiblity2 = () => {
        setPasswordShown2(passwordShown2 ? false : true);
    };
    const togglePasswordVisiblity3 = () => {
        setPasswordShown3(passwordShown3 ? false : true);
    };

    //show-hide popup change password
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //show-hide popup edit profile
    const [showProfile, setShowProfile] = useState(false);
    const handleCloseProfile = () => setShowProfile(false);
    const handleShow2 = () => setShowProfile(true);

    ////show-hide popup edit facility
    const [showFaci, setShowFaci] = useState(false);
    const handleCloseFaci = () => setShowFaci(false);
    const handleShowFaci = () => setShowFaci(true);
    const inf_fetched_ref = useRef(false);

    const [passFocus, setPassFocus] = useState(false);

    const userRef = useRef();

    // DTO for sending change password request
    const [changePasswordDTO, setChangePasswordDTO] = useState({
        userId: sessionStorage.getItem("curUserId"),
        password: "",
        newPassword: ""
    });

    // DTO for updating user's information
    const [updateUserDTO, setUpdateUserDTO] = useState({
        userId: sessionStorage.getItem("curUserId"),
        username: "",
        dob: "",
        email: "",
        address: ""
    });

    // DTO for updating facility's information
    const [updateFacilityDTO, setUpdateFacilityDTO] = useState({
        userId: sessionStorage.getItem("curUserId"),
        facilityId: "",
        facilityName: "",
        facilityAddress: "",
        foundDate: "",
        businessLicenseNumber: "",
        hotline: "",
        status: ""
    });

    //Spliting the user's information into 2 objects: user account information and facility information
    //Account information
    const [accountInformation, setAccountInformation] = useState({
        userId: sessionStorage.getItem("curUserId"),
        userRoleName: "",
        username: "",
        userDob: "",
        userEmail: "",
        userSalary: "",
        userAddress: "",
        userStatus: ""
    });
    //Facility information
    const [facilityInformation, setFacilityInformation] = useState({
        facilityId: sessionStorage.getItem("facilityId"),
        facilityName: "",
        facilityAddress: "",
        facilityFoundDate: "",
        businessLicenseNumber: "",
        hotline: "",
        facilityStatus: "",
        subscriptionId: "",
        subscriptionExpirationDate: ""
    });


    //Full Json addresses
    const [fullAddresses, setFullAddresses] = useState('');
    const [city, setCity] = useState([
        { value: '', label: 'Ch???n T???nh/Th??nh ph???' }
    ]);
    const [district, setDistrict] = useState(''); //For populate dropdowns
    const [ward, setWard] = useState('');
    const [cityIndex, setCityIndex] = useState(); //Save the index of selected dropdowns
    const [districtIndex, setDistrictIndex] = useState();
    const [wardIndex, setWardIndex] = useState();
    const [street, setStreet] = useState();

    //address
    const [userAddress, setUserAddress] = useState(
        {
            street: "",
            ward: "",
            district: "",
            city: ""
        }
    );
    const [faciAddress, setFaciAddress] = useState(
        {
            street: "",
            ward: "",
            district: "",
            city: ""
        }
    );

    const [validPwd, setValidPwd] = useState(false);
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    // Set value for address fields
    //User
    useEffect(() => {
        console.log("Load address");
        loadAddress();
        console.log(fullAddresses);
    }, [addressLoaded]);

    //Get user details
    useEffect(() => {
        if (inf_fetched_ref.current) return;
        inf_fetched_ref.current = true;
        loadUserDetails();
    }, [userDetailLoaded]);

    const loadAddress = async () => {
        const result = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
            {});
        setFullAddresses(result.data);
        console.log("Full address");
        console.log(fullAddresses);
        // Set inf
        const cityList = fullAddresses.slice();
        for (let i in cityList) {
            cityList[i] = { value: cityList[i].Id, label: cityList[i].Name }
        }
        setCity(cityList);
        setAddressLoaded(true);
    }

    const loadUserDetails = async () => {
        const result = await axios.get(USER_DETAIL_URL,
            { params: { userId: sessionStorage.getItem("curUserId") } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                withCredentials: false
            });
        const responseJson = result.data;
        console.log(responseJson);
        setAddressJson(JSON.parse(responseJson.userAddress));
        //Set account information
        setAccountInformation({
            userId: responseJson.userId,
            userRoleName: responseJson.userRoleName,
            username: responseJson.username,
            userDob: responseJson.userDob,
            userEmail: responseJson.userEmail,
            userSalary: responseJson.userSalary,
            userAddress: responseJson.userAddress,
            userStatus: responseJson.userStatus
        })

        setUserAddress(JSON.parse(responseJson.userAddress))
        //Set facility information
        setFacilityInformation({
            facilityId: responseJson.facilityId,
            facilityName: responseJson.facilityName,
            facilityAddress: responseJson.facilityAddress,
            facilityFoundDate: responseJson.facilityFoundDate,
            businessLicenseNumber: responseJson.businessLicenseNumber,
            hotline: responseJson.hotline,
            facilityStatus: responseJson.facilityStatus,
            subscriptionId: responseJson.subscriptionId,
            subscriptionExpirationDate: responseJson.subscriptionExpirationDate
        })
        setFaciAddress(JSON.parse(responseJson.facilityAddress))

    }

    //Function for populating dropdowns
    function loadDistrict(index) {
        console.log("City " + index);
        setCityIndex(index);
        const districtOnIndex = fullAddresses[index].Districts;
        const districtList = districtOnIndex.slice();
        for (let i in districtList) {
            districtList[i] = { value: districtList[i].Id, label: districtList[i].Name }
        }
        setDistrict(districtList);
    }

    //Load user ward list
    function loadWard(districtIndex, cIndex) {
        if (cIndex === -1) {
            cIndex = cityIndex;
        }
        console.log("District " + districtIndex);
        setDistrictIndex(districtIndex);
        const wardOnIndex = fullAddresses[cIndex].Districts[districtIndex].Wards;
        const wardList = wardOnIndex.slice();
        for (let i in wardList) {
            wardList[i] = { value: wardList[i].Id, label: wardList[i].Name }
        }
        setWard(wardList);
    }

    function saveWard(index) {
        console.log("Ward " + index);
        setWardIndex(index);
    }

    function saveAddressJsonUser(s) {
        console.log("ward " + wardIndex);
        setStreet(s);
        addressJson.city = fullAddresses[cityIndex].Name;
        addressJson.district = fullAddresses[cityIndex].Districts[districtIndex].Name;
        addressJson.ward = fullAddresses[cityIndex].Districts[districtIndex].Wards[wardIndex].Name;
        addressJson.street = street;
        updateUserDTO.address = JSON.stringify(addressJson);
    }

    function saveAddressJsonFacility(s) {
        console.log("ward " + wardIndex);
        setStreet(s);
        addressJson.city = fullAddresses[cityIndex].Name;
        addressJson.district = fullAddresses[cityIndex].Districts[districtIndex].Name;
        addressJson.ward = fullAddresses[cityIndex].Districts[districtIndex].Wards[wardIndex].Name;
        addressJson.street = street;
        updateFacilityDTO.facilityAddress = JSON.stringify(addressJson);
    }

    // Get user's information to update
    const handleUpdateUserGet = async () => {
        setShowProfile(true);
        try {
            const response = await axios.get(USER_UPDATE_GET,
                { params: { userId: sessionStorage.getItem("curUserId") } },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false
                }
            );
            const responseJson = response.data;
            //Set User information
            setUpdateUserDTO({
                userId: sessionStorage.getItem("curUserId"),
                username: responseJson.username,
                dob: responseJson.dob,
                email: responseJson.email,
                address: responseJson.address
            });

            // Get index of dropdowns
            console.log("load values");
            console.log(fullAddresses);
            console.log(addressJson);
            for (let i in city) {
                console.log(i);
                if (addressJson.city === city[i].label) {
                    setCityIndex(i);
                    addressJson.city = fullAddresses[i].Name;
                    console.log("City " + i);
                    setCityIndex(i);
                    const districtOnIndex = fullAddresses[i].Districts;
                    const districtList = districtOnIndex.slice();
                    for (let i in districtList) {
                        districtList[i] = { value: districtList[i].Id, label: districtList[i].Name }
                    }
                    setDistrict(districtList);
                    for (let j in districtList) {
                        if (addressJson.district === districtList[j].label) {
                            setDistrictIndex(j);
                            console.log(j);
                            addressJson.district = fullAddresses[i].Districts[j].Name;
                            console.log("District " + j);
                            setDistrictIndex(j);
                            const wardOnIndex = fullAddresses[i].Districts[j].Wards;
                            const wardList = wardOnIndex.slice();
                            for (let i in wardList) {
                                wardList[i] = { value: wardList[i].Id, label: wardList[i].Name }
                            }
                            setWard(wardList);
                            for (let k in wardList) {
                                if (addressJson.ward === wardList[k].label) {
                                    setWardIndex(k);
                                    addressJson.ward = fullAddresses[i].Districts[j].Wards[k].Name;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            setStreet(addressJson.street);
            console.log(addressJson);
            setUserDetailLoaded(true);
        } catch (err) {
            if (!err?.response) {
                toast.error('Server kh??ng ph???n h???i');
            } else {
                toast.error(err.response.data);
            }
        }
    }


    // Get facility's information to update
    const handleUpdateFacilityGet = async () => {
        setShowFaci(true);
        try {
            const response = await axios.get(FACILITY_UPDATE_GET,
                { params: { facilityId: sessionStorage.getItem("facilityId") } },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false
                }
            );
            const responseJson = response.data;
            //Set User information
            setUpdateFacilityDTO({
                userId: sessionStorage.getItem("curUserId"),
                facilityId: sessionStorage.getItem("facilityId"),
                facilityName: responseJson.facilityName,
                facilityAddress: responseJson.facilityAddress,
                foundDate: responseJson.foundDate,
                businessLicenseNumber: responseJson.businessLicenseNumber,
                hotline: responseJson.hotline,
                status: responseJson.status
            });

            // Get index of dropdowns
            console.log("load values");
            console.log(fullAddresses);
            console.log(addressJson);
            for (let i in city) {
                console.log(i);
                if (addressJson.city === city[i].label) {
                    setCityIndex(i);
                    addressJson.city = fullAddresses[i].Name;
                    console.log("City " + i);
                    setCityIndex(i);
                    const districtOnIndex = fullAddresses[i].Districts;
                    const districtList = districtOnIndex.slice();
                    for (let i in districtList) {
                        districtList[i] = { value: districtList[i].Id, label: districtList[i].Name }
                    }
                    setDistrict(districtList);
                    for (let j in districtList) {
                        if (addressJson.district === districtList[j].label) {
                            setDistrictIndex(j);
                            console.log(j);
                            addressJson.district = fullAddresses[i].Districts[j].Name;
                            console.log("District " + j);
                            setDistrictIndex(j);
                            const wardOnIndex = fullAddresses[i].Districts[j].Wards;
                            const wardList = wardOnIndex.slice();
                            for (let i in wardList) {
                                wardList[i] = { value: wardList[i].Id, label: wardList[i].Name }
                            }
                            setWard(wardList);
                            for (let k in wardList) {
                                if (addressJson.ward === wardList[k].label) {
                                    setWardIndex(k);
                                    addressJson.ward = fullAddresses[i].Districts[j].Wards[k].Name;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            setStreet(addressJson.street);
            console.log(addressJson);
            setUserDetailLoaded(true);
        } catch (err) {
            if (!err?.response) {
                toast.error('Server kh??ng ph???n h???i');
            } else {
                toast.error(err.response.data);
            }
        }
    }

    // Update user's information
    const handleUpdateUserSave = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(USER_UPDATE_SAVE,
                updateUserDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false
                }
            );
            const responseJson = response.data;
            console.log(responseJson);
            setUpdateUserDTO('');
            loadUserDetails();
            toast.success("C???p nh???t th??ng tin th??nh c??ng");
            setShowProfile(false);
        } catch (err) {
            if (!err?.response) {
                toast.error('Server kh??ng ph???n h???i');
            } else {
                toast.error(err.response.data);
            }
        }
    }


    // Update facility's information
    const handleUpdateFacilitySave = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(FACILITY_UPDATE_SAVE,
                updateFacilityDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false
                }
            );
            const responseJson = response.data;
            console.log(responseJson);
            setUpdateFacilityDTO('');
            loadUserDetails();
            toast.success("C???p nh???t th??ng tin th??nh c??ng");
            setShowFaci(false);
        } catch (err) {
            if (!err?.response) {
                toast.error('Server kh??ng ph???n h???i');
            } else {
                toast.error(err.response.data);
            }
        }
    }

    // Handle input update information
    // User's profile
    const handleUpdateUser = (event, field) => {
        let actualValue = event.target.value
        setUpdateUserDTO({
            ...updateUserDTO,
            [field]: actualValue
        })
    }

    // Facility
    const handleUpdateFacility = (event, field) => {
        let actualValue = event.target.value
        setUpdateFacilityDTO({
            ...updateFacilityDTO,
            [field]: actualValue
        })
    }

    //Check Repassword and Regex password
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(changePasswordDTO.newPassword));
        setValidMatch(changePasswordDTO.newPassword === matchPwd);
    }, [changePasswordDTO.newPassword, matchPwd])

    const handleChange = (event, field) => {
        let actualValue = event.target.value
        setChangePasswordDTO({
            ...changePasswordDTO,
            [field]: actualValue
        })
    }

    //Change password through Axios
    const handleSubmit = async (event) => {
        event.preventDefault();
        const v2 = PWD_REGEX.test(changePasswordDTO.newPassword);
        if (!v2) {
            toast.error("M???t kh???u sai ?????nh d???ng");
            return;
        }
        try {
            const response = await axios.post(CHANGE_PASS_URL,
                changePasswordDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false
                }
            );
            console.log(JSON.stringify(response?.data));
            setChangePasswordDTO('');
            toast.success("?????i m???t kh???u th??nh c??ng")
            setShow(false)
        } catch (err) {
            if (!err?.response) {
                toast.error('Server kh??ng ph???n h???i');
            } else {
                toast.error(err.response.data);
            }
        }

    }

    return (
        <div className="profile-info">
            <h2>Th??ng tin c?? nh??n</h2>
            <div className="row outbox">
                <div className="col-md-6 col-sm-12">
                    <div className="card">
                        <div className="card-header"><p id="titleUserProfile" >Th??ng tin ng?????i d??ng</p></div>
                        <div className="card-body">
                            <div className="tab-pane " >
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>S??? ??i???n tho???i</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p id="account">{sessionStorage.getItem("curPhone").substring(0, 2) + "*****" + sessionStorage.getItem("curPhone").substring(7)}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>H??? v?? T??n</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p id="username">{accountInformation.username}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>Ng??y sinh</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p id="dob">{accountInformation.userDob}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>Email</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p id="email">{accountInformation.userEmail}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>?????a ch???</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p id="userAddress">{userAddress.street + ", " + userAddress.ward + ", " + userAddress.district + ", " + userAddress.city}</p>
                                    </div>
                                </div>
                                {/*Start: Change account details*/}
                                <div className="row">
                                    <div className="col-md-6">
                                        <Button onClick={handleShow} style={{ width: "100%" }} className="btn btn-light" id="startChangePassword">?????i m???t kh???u</Button >
                                        <Modal show={show} onHide={handleClose}
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered >
                                            <Modal.Header closeButton onClick={handleClose}>
                                                <Modal.Title>Thay ?????i m???t kh???u <p style={{ color: "grey", fontSize: "20px" }} id="pwdnote" data-text=" 8 - 20 k?? t???. Bao g???m 1 ch??? c??i vi???t hoa, 1 s??? v?? 1 k?? t??? ?????c bi???t (!,@,#,$,%)"
                                                    className="tip invalid" ><FontAwesomeIcon icon={faInfoCircle} /></p></Modal.Title>
                                            </Modal.Header>
                                            <form onSubmit={handleSubmit} style={{ margin: "10px" }}>
                                                <div className="changepass">
                                                    <div className="row ">
                                                        <div className="col-md-6 ">
                                                            <p>M???t kh???u c??</p>
                                                        </div>
                                                        <div className="col-md-6 pass-wrapper ">
                                                            <input ref={userRef} id="oldPassword" onChange={e => handleChange(e, "password")}
                                                                value={changePasswordDTO.password} required
                                                                type={passwordShown ? "text" : "password"}
                                                                minLength="8" maxLength="20"
                                                                className="form-control " />
                                                            <i onClick={togglePasswordVisiblity}>{eye}</i>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p>M???t kh???u m???i <FontAwesomeIcon className="star" icon={faStarOfLife} />
                                                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                                                <FontAwesomeIcon icon={faTimes} className={validPwd || !changePasswordDTO.newPassword ? "hide" : "invalid"} />
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6 pass-wrapper">

                                                            <input ref={userRef} onChange={e => handleChange(e, "newPassword")}
                                                                value={changePasswordDTO.newPassword} required
                                                                id="newPassword"
                                                                aria-invalid={validPwd ? "false" : "true"}
                                                                aria-describedby="pwdnote"
                                                                type={passwordShown2 ? "text" : "password"}
                                                                className="form-control "
                                                                minLength="8" maxLength="20" onFocus={() => setPassFocus(true)}
                                                                onBlur={() => setPassFocus(false)}
                                                            />
                                                            <i onClick={togglePasswordVisiblity2}>{eye}</i>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p>X??c nh???n l???i
                                                                <FontAwesomeIcon className="star" icon={faStarOfLife} />
                                                                <FontAwesomeIcon icon={faCheck} className={validMatch ? "valid" : "hide"} />
                                                                <FontAwesomeIcon icon={faTimes} className={validMatch || changePasswordDTO.newPassword ? "hide" : "invalid"} /></p>
                                                        </div>
                                                        <div className="col-md-6 pass-wrapper">
                                                            <input ref={userRef}
                                                                id="confirm_pwd"
                                                                onChange={(e) => setMatchPwd(e.target.value)}
                                                                value={matchPwd}
                                                                required
                                                                aria-invalid={validMatch ? "false" : "true"}
                                                                aria-describedby="confirmnote"
                                                                type={passwordShown3 ? "text" : "password"}
                                                                className="form-control "
                                                                minLength="8" maxLength="20" />
                                                            <i onClick={togglePasswordVisiblity3}>{eye}</i>
                                                        </div>

                                                    </div>
                                                </div>
                                                {/* <h6 id="pwdnote" >
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    &nbsp; 8 - 20 k?? t???.<br />
                                                    Bao g???m 1 ch??? c??i vi???t hoa, 1 s??? v?? 1 k?? t??? ?????c bi???t.<br />
                                                    C??c k?? t??? ?????c bi???t cho ph??p: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                                    <br /> M???t kh???u m???i kh??ng ???????c tr??ng v???i m???t kh???u c??
                                                    <br />M???t kh???u x??c nh???n l???i ph???i tr??ng v???i m???t kh???u ???? nh???p ??? tr??n

                                                </h6> */}
                                                <div className='model-footer'>
                                                    <button className="btn btn-light" style={{ width: "30%" }} id="confirmChangePassword">
                                                        ?????i m???t kh???u
                                                    </button>
                                                    <button className="btn btn-light" style={{ width: "20%" }} onClick={handleClose} id="cancelChangePassword">
                                                        Hu???
                                                    </button>
                                                </div>
                                            </form>
                                        </Modal>
                                    </div>
                                    <div className="col-md-6">
                                        <Button onClick={handleUpdateUserGet} style={{ width: "100%" }} className="btn btn-light" id="startChangeUserInformation">C???p nh???t</Button >
                                        <Modal show={showProfile} onHide={handleCloseProfile}
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered >
                                            <form onSubmit={handleUpdateUserSave}>
                                                <Modal.Header><h4>Ch???nh s???a th??ng tin c?? nh??n</h4></Modal.Header>
                                                <Modal.Body>
                                                    <div className="row">
                                                        <div className="col-md-6 ">
                                                            <p>H??? v?? t??n<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input type="text" className="form-control" name="username" id="updateUsername"
                                                                ref={userRef} onChange={e => handleUpdateUser(e, "username")}
                                                                value={updateUserDTO.username} required />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6 ">
                                                            <p>Ng??y sinh<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input type="date" className="form-control" name="dob" id="updateDob"
                                                                ref={userRef} onChange={e => handleUpdateUser(e, "dob")}
                                                                value={updateUserDTO.dob} required />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p>Email</p>
                                                        </div>
                                                        <div className=" col-md-6">
                                                            <input type="email" className="form-control" name="email" id="updateEmail"
                                                                ref={userRef} onChange={e => handleUpdateUser(e, "email")}
                                                                value={updateUserDTO.email} />
                                                        </div>
                                                    </div>
                                                    {/*City*/}
                                                    <div className="row">
                                                        <div className="col-md-6 ">
                                                            <p>Th??nh ph???<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <select className="form-control mt-1" id="uprovince"
                                                                ref={userRef}
                                                                autoComplete="off"
                                                                onChange={(e) => loadDistrict(e.target.value)}
                                                                value={cityIndex}
                                                                required>
                                                                <option value="" disabled>Ch???n T???nh/Th??nh ph???</option>
                                                                {city &&
                                                                    city.map((item, index) => (
                                                                        <>
                                                                            {item.label === addressJson.city
                                                                                ? <option value={index} selected>{item.label}</option>
                                                                                : <option value={index}>{item.label}</option>
                                                                            }
                                                                        </>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {/*District*/}
                                                    <div className="row">
                                                        <div className="col-md-6 ">
                                                            <p>Qu???n/Huy???n<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <select className="form-control mt-1" id="udistrict"
                                                                ref={userRef}
                                                                autoComplete="off"
                                                                onChange={(e) => loadWard(e.target.value, -1)}
                                                                value={districtIndex}
                                                                required>
                                                                <option value="" disabled>Ch???n Qu???n/Huy???n</option>
                                                                {district &&
                                                                    district.map((item, index) => (
                                                                        <>
                                                                            {item.label === addressJson.district
                                                                                ? <option value={index} selected>{item.label}</option>
                                                                                : <option value={index}>{item.label}</option>
                                                                            }
                                                                        </>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {/*Ward*/}
                                                    <div className="row">
                                                        <div className="col-md-6 ">
                                                            <p>Ph?????ng x??<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <select className="form-control mt-1" id="uward"
                                                                ref={userRef}
                                                                autoComplete="off"
                                                                onChange={(e) => saveWard(e.target.value)}
                                                                value={wardIndex}
                                                                required>
                                                                <option value="" disabled>Ch???n Ph?????ng/X??</option>
                                                                {ward &&
                                                                    ward.map((item, index) => (
                                                                        <>
                                                                            {item.label === addressJson.ward
                                                                                ? <option value={index} selected>{item.label}</option>
                                                                                : <option value={index}>{item.label}</option>
                                                                            }
                                                                        </>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {/*Street*/}
                                                    <div className="row">
                                                        <div className="col-md-6 ">
                                                            <p>S??? nh??<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input type="text" id="uhomenum"
                                                                ref={userRef}
                                                                autoComplete="off"
                                                                onChange={(e) => saveAddressJsonUser(e.target.value)}
                                                                required
                                                                className="form-control"
                                                                value={addressJson.street} />
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                                <div className='model-footer'>
                                                    <button style={{ width: "30%" }} className="col-md-6 btn-light" type='submit' id="submitUserUpdate">
                                                        X??c nh???n
                                                    </button>
                                                    <button style={{ width: "20%" }} className="btn btn-light" onClick={handleCloseProfile} type='button' id="cancelUserUpdate">
                                                        Hu???
                                                    </button>
                                                </div>
                                            </form>
                                        </Modal>

                                    </div>
                                </div>
                                {/*End: Chnage account details*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="card">

                        {facilityInformation.facilityId == null
                            ? <div>
                                <div className="card-header">Th??ng tin c?? s???</div>
                                <div className="card-body"> Ng?????i d??ng hi???n ch??a c?? c?? s???; vui l??ng t???o m???i ho???c k??ch ho???t c?? s???. </div>
                            </div>
                            : <div>
                                <div className="card-header"><p id="facilityName" >Th??ng tin c?? s???</p></div>
                                <div className="card-body">
                                    <form>
                                        <div className="tab-pane " >
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>T??n c?? s???</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="facilityName">{facilityInformation.facilityName}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>Ng??y th??nh l???p</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="facilityFoundDate">{facilityInformation.facilityFoundDate}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>M?? s??? kinh doanh</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="licenseNumber">{facilityInformation.businessLicenseNumber}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>S??? nh??</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="street">{faciAddress.street}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>X??</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="ward">{faciAddress.ward}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>Qu???n/Huy???n</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="state">{faciAddress.district}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>Th??nh ph???</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="city">{faciAddress.city}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>Hotline</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p id="hotline">{facilityInformation.hotline}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>G??i ????ng k??</p>
                                                </div>
                                                <div className="col-md-6">
                                                    {facilityInformation.subscriptionId === ''
                                                        ? <p id="subscription">Ch??a ????ng k?? g??i</p>
                                                        : <p id="subscription">G??i {facilityInformation.subscriptionId}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div style={{ textAlign: "center" }}>
                                        <button className="btn btn-light" onClick={handleUpdateFacilityGet} style={{ width: "50%" }}>C???p nh???t</button>
                                    </div>
                                    <Modal show={showFaci} onHide={handleCloseFaci}
                                        size="lg"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered >
                                        <form onSubmit={handleUpdateFacilitySave}>
                                            <Modal.Header><h4>Ch???nh s???a th??ng tin c?? s???</h4></Modal.Header>
                                            <Modal.Body>
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>T??n c?? s???<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6 ">
                                                        <input type="text" className="form-control" name="username" id="updateFacilityName"
                                                            ref={userRef} onChange={e => handleUpdateFacility(e, "facilityName")}
                                                            value={updateFacilityDTO.facilityName} required />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>Ng??y th??nh l???p<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6 ">
                                                        <input type="text" className="form-control" name="foundDate" id="updateFoundDate"
                                                            ref={userRef} onChange={e => handleUpdateFacility(e, "foundDate")}
                                                            value={updateFacilityDTO.foundDate} required />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>M?? ????ng k?? kinh doanh<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6 ">
                                                        <input type="text" className="form-control" name="businessLicenseNumber" id="updateBusinessLicenseNumber"
                                                            ref={userRef} onChange={e => handleUpdateFacility(e, "businessLicenseNumber")}
                                                            value={updateFacilityDTO.businessLicenseNumber} required />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>Hotline<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6 ">
                                                        <input type="text" className="form-control" name="Hotline" id="updateHotline"
                                                            ref={userRef} onChange={e => handleUpdateFacility(e, "hotline")}
                                                            value={updateFacilityDTO.hotline} required />
                                                    </div>
                                                </div>
                                                {/*City*/}
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>Th??nh ph???<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <select className="form-control mt-1" id="uprovince"
                                                            ref={userRef}
                                                            autoComplete="off"
                                                            onChange={(e) => loadDistrict(e.target.value)}
                                                            value={cityIndex}
                                                            required>
                                                            <option value="" disabled>Ch???n T???nh/Th??nh ph???</option>
                                                            {city &&
                                                                city.map((item, index) => (
                                                                    <>
                                                                        {item.label === addressJson.city
                                                                            ? <option value={index} selected>{item.label}</option>
                                                                            : <option value={index}>{item.label}</option>
                                                                        }
                                                                    </>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                {/*District*/}
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>Qu???n/Huy???n<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <select className="form-control mt-1" id="udistrict"
                                                            ref={userRef}
                                                            autoComplete="off"
                                                            onChange={(e) => loadWard(e.target.value, -1)}
                                                            value={districtIndex}
                                                            required>
                                                            <option value="" disabled>Ch???n Qu???n/Huy???n</option>
                                                            {district &&
                                                                district.map((item, index) => (
                                                                    <>
                                                                        {item.label === addressJson.district
                                                                            ? <option value={index} selected>{item.label}</option>
                                                                            : <option value={index}>{item.label}</option>
                                                                        }
                                                                    </>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                {/*Ward*/}
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>Ph?????ng x??<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <select className="form-control mt-1" id="uward"
                                                            ref={userRef}
                                                            autoComplete="off"
                                                            onChange={(e) => saveWard(e.target.value)}
                                                            value={wardIndex}
                                                            required>
                                                            <option value="" disabled>Ch???n Ph?????ng/X??</option>
                                                            {ward &&
                                                                ward.map((item, index) => (
                                                                    <>
                                                                        {item.label === addressJson.ward
                                                                            ? <option value={index} selected>{item.label}</option>
                                                                            : <option value={index}>{item.label}</option>
                                                                        }
                                                                    </>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                {/*Street*/}
                                                <div className="row">
                                                    <div className="col-md-6 ">
                                                        <p>S??? nh??<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input type="text" id="uhomenum"
                                                            ref={userRef}
                                                            autoComplete="off"
                                                            onChange={(e) => saveAddressJsonFacility(e.target.value)}
                                                            required
                                                            className="form-control"
                                                            value={addressJson.street} />
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                            <div className='model-footer'>
                                                <button style={{ width: "30%" }} className="col-md-6 btn-light" type='submit' id="submitFaciUpdate">
                                                    X??c nh???n
                                                </button>
                                                <button style={{ width: "20%" }} className="btn btn-light" onClick={handleCloseFaci} type='button' id="cancelFaciUpdate">
                                                    Hu???
                                                </button>
                                            </div>
                                        </form>
                                    </Modal>

                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" />
        </div>
    )
}


export default Profile