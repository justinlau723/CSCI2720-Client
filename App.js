import React, { Component, useState } from "react";
import{BrowserRouter, Routes, Route,Link,useNavigate} from "react-router-dom";
import './2720proj.css';
import './LEMONMILK-Regular.otf';
import './favicon.ico'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      	<Route path="/login" element={<Login/>} />
        <Route path="/admin/location" element={<AdminLocation/>} />
        <Route path="/admin/users" element={<AdminUsers/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}


function Login(){
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate();

  const usernameOnChangeHandler = (e)=>{
    setUsername(e.target.value)
  }

  const passwordOnChangeHandler = (e)=>{
    setPassword(e.target.value)
  }

  const loginOnClickHandler = async()=>{
    const res = await fetch('http://localhost:3000/admin/login',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
      await res.json().then(res=>localStorage.setItem('jwt', res.accessToken)).catch(err=>console.log(err))
      navigate('/admin/location', {replace: true})
    }
        return 
    }

  return(
    
    <div className = "w3-cotainer" height= "100%">
        <header><div className="header" id="titlebar">
                <img src={require('./header.png')} width = "1020"/>
        </div></header>
        <section id ="adminMain">
              <p id="adminlogin_logo"><img src={require("./logo3.png" )} width="120" /></p>
              <div id="adminlogin_frame">
                 <p id="adminimage_logo"><img src={require("./logo.png")}width="300" /></p>
                 <form>
                 <p><img className="label_input" src={require("./logo1.png")} width="50"/><input onChange={usernameOnChangeHandler} type="text" id="username" className="text_field" placeholder="USERNAME" required="required"/></p>
                 <p><img className="label_input" src={require("./logo2.png")} width="50"/><input onChange={passwordOnChangeHandler} type="text" id="password" className="text_field" placeholder="PASSWORD" required="required"/></p>
                 </form>
                 <div id="adminlogin_control">
                   <button id="btn_login" onClick={loginOnClickHandler}>Login</button>          
                    </div>
            </div>
        </section>
                <div id="adminfooter">
                    <p id="btn">© 2022 Spring Semester CSCI2720 Building Web Applications GROUP 13</p>
                </div>
    </div>
  )
}


class ShowAllUser extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        buf:'',
        buffer:'',
        jwt: localStorage.getItem('jwt')
    };
  }
   fetchUpcoming () {
    fetch(`http://localhost:3000/admin/users/read`, {
      headers:{
          'Authorization': `Bearer ${this.state.jwt}`
      }})
        .then(res => res.json())
        .then(res => {    
        this.setState({ buf: "1",
          buffer: res }) 
          console.log(res)
        }
        )
}

render() {
  return(
      <>
      <button style={{width:"30%",border: "none"}}onClick={(e) => this.fetchUpcoming(e)}>Show All </button>
      {this.state.buf&&<tr><td>{"UserID"}</td><td>{"Username"}</td></tr>}
      {this.state.buf&&(this.state.buffer.map((element,index)=><UserCard i={element}key={index}/>))}
      </>
  )
}
}


class UserCard extends React.Component{
  render(){
      let i = this.props.i;
      return(
        <div>
          <table>
             <tr>
                <td>{i.userID}</td>
                <td>{i.username}</td>
            </tr>
            </table>
        </div>
      )
     
  }
}

function AdminNav(){
  const navigate = useNavigate();
  const logoutOnClickHandler = ()=>{
    localStorage.removeItem('jwt')
    navigate('/login', {replace: true})

  }
  return (
    <div id = "adminNavBar" > 
    <ul>
    <li><button  onClick={logoutOnClickHandler}>Logout</button></li>
      <li><Link to="/admin/users">Users</Link></li>
      <li><Link to="/admin/location">Location</Link></li>
    </ul>
    </div>
  );
}

function AdminUsers(){
  const [show, setShow] = useState()
  const [navH, setnavH] = useState()
  const [userID, setUserID] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [createState, setCreateState] = useState()
  const [updateState, setUpdateState] = useState()
  const [deleteState, setDeleteState] = useState()
  const [serverState, setServerState] = useState()
  const jwt = localStorage.getItem('jwt')
  const showAll = (e)=>{
    setDeleteState()
    setUpdateState()
    setCreateState()
    setShow("true")
  }
  const userIDOnChangeHandler = (e)=>{
    setUserID(e.target.value)
  }
  const usernameOnChangeHandler = (e)=>{
    setUsername(e.target.value)
  }
  const passwordOnChangeHandler = (e)=>{
    setPassword(e.target.value)
  }
  const userCreate = (e)=>{
    setShow()
    setDeleteState()
    setUpdateState()
    setCreateState("New User Creation")
  }

  const userUpdate = (e)=>{
    setShow()
    setDeleteState()
    setCreateState()
    setUpdateState("Update User")
  }

  
  const userDelete = (e)=>{
    setShow()
    setUpdateState()
    setCreateState()
    setDeleteState("Please enter the User Id of the user you want to delete:")
  }
  const createUser = async()=>{
    const res = await fetch('http://localhost:3000/admin/users/create',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'Accept': "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
      setServerState('Create Successfully')
    }
    else{
      setServerState('Create Failed')
    }
        return 
    }

  const updateUser = async()=>{
    const res = await fetch('http://localhost:3000/admin/users/update',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'Accept': "application/json"
        },
        body: JSON.stringify({
            "userID"  : userID,
            "username": username,
            "password": password
        })
    })
    if(res.ok){
      setServerState('Update Successfully')
    }
    else{
      setServerState('Update Failed')
    }
        return 
    }

    const deleteUser = async()=>{
      const res = await fetch('http://localhost:3000/admin/users/delete', {
        method: 'DELETE',
          headers:{
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json',
              'Accept': "application/json"
          },
          body: JSON.stringify({
              "userID"  : userID,
          })
      })
      if(res.ok){
        setServerState('Delete Successfully')
      }
      else{
        setServerState('Delete Failed')
      }
      
    }
    const adminNavOpen = ()=>{
      document.getElementById("adminUserNav").style.width = "10%";
      document.getElementById("adminUserText").style.marginLeft = "10%";
      setnavH()
    }
    const adminNavClose = ()=>{
      document.getElementById("adminUserNav").style.width = "0";
      document.getElementById("adminUserText").style.marginLeft = "0";
      setnavH("Y")
    }

  return(
    <>
    
    <div className="back">
    {navH?<div classname = "navOpen" ><button onClick={adminNavOpen}>&#9776;</button></div>:''}
    <AdminNav/>
    <div className  = "adminVerNav" id = "adminUserNav">
    <button onClick={adminNavClose}>&times;</button>
      <button onClick={showAll}>Read</button>
      <button onClick={userCreate}>Create</button>
      <button onClick={userUpdate}>Update</button>
      <button onClick={userDelete}>Delete</button>
    </div>
    <div className = "adminText" id = "adminUserText">
    
    <h1>User Control Panel </h1>
       {show? <ShowAllUser/>:''}
        {<div className="adminLabel"><p>{createState}</p></div>}
        {createState?  <div className = "adminLabel"><p>New User ID:</p></div>:''}
        {createState? <p><input className = 'adminInput' onChange={usernameOnChangeHandler} type="text" /></p>:''}
        {createState?  <div className = "adminLabel"><p>New User Password:</p></div>:''}
        {createState? <p><input className = 'adminInput' onChange={passwordOnChangeHandler} type="text" /></p>:''}
        {createState? <button onClick={createUser}>Create</button>:''}

        {<div className="adminLabel"><p>{updateState}</p></div>}
        {updateState?  <div className = "adminLabel"><p>User ID you want to update:</p></div>:''}
        {updateState? <p><input className = 'adminInput' onChange={userIDOnChangeHandler} type="text" /></p>:''}
        {updateState?  <div className = "adminLabel"><p>New Username:</p></div>:''}
        {updateState?<p><input className = 'adminInput' onChange={usernameOnChangeHandler} type="text" /></p>:''}
        {updateState?  <div className = "adminLabel"><p>New Password:</p></div>:''}
        {updateState? <p><input className = 'adminInput' onChange={passwordOnChangeHandler} type="text" /></p>:''}
        {updateState? <button onClick={updateUser}>Update</button>:''}

        {<div className="adminLabel"><p>{deleteState}</p></div>}
        {deleteState? <p><input className = 'adminInput' onChange={userIDOnChangeHandler} type="text" /></p>:''}
        {deleteState? <button onClick={deleteUser}>Delete</button>:''}
      
        {serverState}
       
      </div>
      </div>
    </>
  );
}


class ShowAllLocation extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        buf: '',
        buffer:'',
        jwt: localStorage.getItem('jwt')
    };
  } 
   fetchUpcoming () {
    fetch(`http://localhost:3000/admin/location/read`, {
      headers:{
          'Authorization': `Bearer ${this.state.jwt}`
      }})
        .then(res => res.json())
        .then(res => {
         console.log(res)
          this.setState({ buf: "1",
            buffer: res
          })
    
        }
        )
}
render() {
  return(
      <>
      <button style={{width:"30%",border: "none"}} onClick={(e) => this.fetchUpcoming(e)}>Show All</button>
      {this.state.buf&&<tr><td>{"LocationID"}</td><td>{"Location name"}</td><td>{"Temperature"}</td></tr>}
      {this.state.buf&&(this.state.buffer.map((element,index)=><LocationCard i={element}key={index}/>))}
      </>
  )
}
}

class LocationCard extends React.Component{
  render(){
    let index = this.props.i;
    return(
    <div> 
            <table>
            <tr>
              <th>{index.locationID}</th>
              <th>{index.info.name}</th>
              <th>{index.weather.temp_c + "°C"}  </th>
              </tr>
            </table>
             
        </div>
    );
}
}

function AdminLocation(){
  const [navH, setnavH] = useState()
  const [show,setShow] =useState()
  const [locID, setLocID] = useState()
  const [locname, setLocname] = useState()
  const [createState, setCreateState] = useState()
  const [updateState, setUpdateState] = useState()
  const [deleteState, setDeleteState] = useState()
  const [serverState, setServerState] = useState()
  const jwt = localStorage.getItem('jwt')

  const locIDOnChangeHandler = (e)=>{
    setLocID(e.target.value)
  }
  const locnameOnChangeHandler = (e)=>{
    setLocname(e.target.value)
  }

  const updateLocationData = async()=>{
    setShow()
    setServerState()
    setCreateState()
    setUpdateState()
    setDeleteState()
    const res = await fetch('http://localhost:3000/admin/updateLocationsData', {
        headers:{
            'Authorization': `Bearer ${jwt}`
        }
    })
    if(res.ok){
      res.json().then(res=>{
        console.log(res)  
        })
        setServerState('Update Successfully')
    }
    else{
      setServerState('Update Failed')
    }

  }
  
  const createLocation = async()=>{
    const res = await fetch('http://localhost:3000/admin/location/create',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'Accept': "application/json"
        },
        body: JSON.stringify({
            "name": locname,
        })
    })
    if(res.ok){
      setServerState('Create Successfully')
    }
    else{
      setServerState('Create Failed')
    }
        return 
    }
  
    const showAll = (e)=>{
      setLocID()
      setLocname()
      setDeleteState()
      setUpdateState()
      setCreateState()
      setServerState()
      setShow("true")
    }
    const locCreate = (e)=>{
      setShow()
      setLocID()
      setLocname()
      setDeleteState()
      setUpdateState()
      setServerState()
      setCreateState("Please enter the name of the location you want to create:")
    }

    const locUpdate = (e)=>{
      setShow()
      setLocID()
      setLocname()
      setDeleteState()
      setCreateState()
      setServerState()
      setUpdateState("Update Location")
    }

    const locDelete = (e)=>{
      setShow()
      setLocID()
      setLocname()
      setUpdateState()
      setCreateState()
      setServerState()
      setDeleteState("Please enter the location Id of the location you want to delete")
    }


  const updateLocation = async()=>{
    const res = await fetch('http://localhost:3000/admin/location/update',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'Accept': "application/json"
        },
        body: JSON.stringify({
            "locationID"  : locID,
            "name": locname,
        })
    })
    if(res.ok){
      setServerState('Update Successfully')
    }
    else{
      setServerState('Update Failed')
    }
        return 
    }

    const deleteLocation = async()=>{
      const res = await fetch('http://localhost:3000/admin/location/delete', {
        method: 'DELETE',
          headers:{
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json',
              'Accept': "application/json"
          },
          body: JSON.stringify({
              "locationID"  : locID,
          })
      })
      if(res.ok){
        setServerState('Delete Successfully')
      }
      else{
        setServerState('Delete Failed')
      }
      
      }
      const adminNavOpen = ()=>{
        document.getElementById("adminLocNav").style.width = "10%";
        document.getElementById("adminLocText").style.marginLeft = "10%";
        setnavH()
      }
      const adminNavClose = ()=>{
        document.getElementById("adminLocNav").style.width = "0";
        document.getElementById("adminLocText").style.marginLeft = "0";
        setnavH("Y")
      }
  return(
    <>
    <div className="back">
       {navH?<div classname = "navOpen" ><button onClick={adminNavOpen}>&#9776;</button></div>:''}
    <AdminNav/>
    <div className  = "adminVerNav" id = "adminLocNav">
    <button onClick={adminNavClose}>&times;</button>
    <button onClick={updateLocationData}>Update Data</button>
      <button onClick={showAll}>Read</button>
      <button onClick={locCreate}>Create</button>
      <button onClick={locUpdate}>Update</button>
      <button onClick={locDelete}>Delete</button>
    </div>
    <div className = "adminText" id ="adminLocText">
      <h1 >Location Control Panel</h1>
       {show? <ShowAllLocation/> : '' }
        {<div className = "adminLabel"><p>{createState}</p></div>}
        {createState? <p><input  onChange={locnameOnChangeHandler} type="text" /></p>:''}
        {createState? <button   onClick={createLocation}>Create</button>:''}
      
        {<div className = "adminLabel"><p>{updateState}</p></div>}
        {updateState?  <div className = "adminLabel"><p>Location ID you want to replace:</p></div>:''}
        {updateState? <p><input onChange={locIDOnChangeHandler} type="text" /></p>:''}
        {updateState?  <div className = "adminLabel"><p>New Location:</p></div>:''}
        {updateState? <p><input className = 'adminInput' onChange={locnameOnChangeHandler} type="text"/></p>:''}
        {updateState? <button onClick={updateLocation}>Update</button>:''}
       

        {<div className = "adminLabel"><p>{deleteState}</p></div>}
        {deleteState? <p><input className = 'adminInput' onChange={locIDOnChangeHandler} type="text" /></p>:''}
        {deleteState? <button onClick={deleteLocation}>Delete</button>:''}
        {serverState}
       
      </div>
      </div>
    </>
  );
}




export default App;
