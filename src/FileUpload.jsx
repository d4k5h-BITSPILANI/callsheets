import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Grid, Paper, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import './styles.css';
import { useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext'; 
import axios from 'axios';
const supabaseUrl = 'https://bbzeapqhbmyrggqphapv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiemVhcHFoYm15cmdncXBoYXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NTY0MjUsImV4cCI6MjAyNTIzMjQyNX0.3a9JTgNQ6-atB9XgrRZeOfl-vP6E4hp_ajzm3xGRYDc';
export const supabase = createClient(supabaseUrl, supabaseKey);
import './styles.css'
import * as XLSX from 'xlsx';

const FileUpload = ({ type, currentProject }) => {
  const location = useLocation();
  const {callsheet_id } = location.state || {};

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [scriptFormat, setScriptFormat] = useState('parse-script');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const toggleScriptFormat = () => {
    setScriptFormat((prevFormat) => (prevFormat === 'parse-script' ? 'add-script' : 'parse-script'));
  };

  const uploadFile = async () => {
    if (!file || !currentProject) return;

    setUploading(true);
    const callsheetId = callsheet_id;
    const projectId = currentProject.project_id;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `https://callsheet-backend.centralindia.cloudapp.azure.com/${scriptFormat}/?callsheet_id=${callsheetId}&project_id=${projectId}`,
        formData,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
//        console.log('File uploaded successfully:', response.data);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
        }, 2000);
      } else {
        // console.error('Error uploading file:', response.status, response.data);
        alert('Error uploading file:', response.status, response.data);
      }
    } catch (error) {
      // console.error('Error uploading file:', error.message);
      alert('Error uploading file: select a project', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box component={Paper} p={0.8} mb={3} className="upload-box">
      <p className='upload-sub'>Your {type}</p>
      <input
        name="a"
        type="file"
        accept=".pdf, .xlsx, .xls"
        className="upload"
        onChange={handleFileChange}
      />

      <div className='mid-box'>
        {uploadSuccess && (
          <Typography variant='body1' color="green">
            <CheckCircleOutlineIcon className='circle' /> Upload complete. Check Your Mobile App for further steps
          </Typography>
        )}
      </div>

      <div className="toggle-button" onClick={toggleScriptFormat}>
        {scriptFormat === 'parse-script' ? 'Upload (PDF) - Final Draft' : 'Upload (PDF) - Other Formats'}
      </div>

      <button onClick={uploadFile} disabled={uploading || !currentProject} className="upload-button">
        {uploading ? 'Uploading...' : `Upload ${type}`}
      </button>
    </Box>
  );
};

const FileUpload1 = ({ type, currentProject }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file || !currentProject) return;

    setUploading(true);
    const projectId = currentProject.project_id;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `https://callsheet-backend.centralindia.cloudapp.azure.com/parse-schedule/?project_id=${projectId}`,

        formData,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
  //      console.log('File uploaded successfully:', response.data);
        setUploadSuccess(true);
      } else {
    //    console.error('Error uploading file:', response.status, response.data);
      }
    } catch (error) {
      //console.error('Error uploading file:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box component={Paper} p={0.8} mb={3} className="upload-box">
      <p className='upload-sub'>Your {type}</p>
      <input
        name="a"
        type="file"
        accept=".pdf, .xlsx, .xls"
        className="upload"
        onChange={handleFileChange}
      />

      <div className='mid-box'>
        {uploadSuccess && <Typography variant='body1' color="green"><CheckCircleOutlineIcon className='circle' /> Upload complete. Check Your Mobile App for further steps</Typography>}
      </div>


      <button onClick={uploadFile} disabled={uploading || !currentProject} className="upload-button">
        {uploading ? 'Uploading...' : `Upload ${type}`}
      </button>
    </Box>
  );
};

const CastUpload = ({ type, currentProject }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const location = useLocation();
  const {callsheet_id } = location.state || {};

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file || !currentProject) return;

    setUploading(true);
    const callsheetId = callsheet_id;
    const projectId = currentProject.project_id;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const castData = worksheet.map((row) => ({
        name: row['artist name'],
        role: row['role'],
        phone: row['phone number'],
        callsheet_id: callsheetId,
        project_id: projectId,
      }));
      //console.log(castData);
    
      const { data: insertData, error } = await supabase
        .from('principal_artist')
        .insert(castData).select();

      if (error) {
        //console.error('Error uploading data:', error.message);
        
      } else {
        //console.log('Data uploaded successfully:', insertData, error);
        setUploadSuccess(true);
        setTimeout(()=>{
          setUploadSuccess(false);
        },[12000]);
      }
    } catch (error) {
      //console.error('Error processing file:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box component={Paper} p={0.8} mb={3} className="upload-box">
      <p className='upload-sub'>Your {type}</p>
      <input
        name="a"
        type="file"
        accept=".xlsx"
        className="upload"
        onChange={handleFileChange}
      />
      <div className='mid-box'>
        {uploadSuccess && (
          <Typography variant='body1' color="green">
            <CheckCircleOutlineIcon className='circle' /> Upload complete. Check Your Mobile App for further steps
          </Typography>
        )}
      </div>
      <button onClick={uploadFile} disabled={uploading || !currentProject} className="upload-button">
        {uploading ? 'Uploading...' : `Upload ${type}`}
      </button>
    </Box>
  );
};

const CrewUpload = ({ type, currentProject }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const location = useLocation();
  const {callsheet_id } = location.state || {};

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file || !currentProject) return;

    setUploading(true);
    const callsheetId = callsheet_id;
    const projectId = currentProject.project_id;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const crewData = worksheet.map((row) => ({
        Name: row['artist name'],
        Designation: row['role'],
        Phone: row['phone number'],
        callsheet_id: callsheetId,
        project_id: projectId,
      }));
      //console.log(crewData)

      const { data: insertData, error } = await supabase
        .from('crew')
        .insert(crewData).select();

      if (error) {
        console.error('Error uploading data:', error.message);
        
      } else {
        console.log('Data uploaded successfully:', insertData, error);
        setUploadSuccess(true);
        setTimeout(()=>{
          setUploadSuccess(false);
        },[12000]);
      }
    } catch (error) {
      console.error('Error processing file:', error.message);
      // alert('Error processing file:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box component={Paper} p={0.8} mb={3} className="upload-box">
      <p className='upload-sub'>Your {type}</p>
      <input
        name="a"
        type="file"
        accept=".xlsx"
        className="upload"
        onChange={handleFileChange}
      />

      <div className='mid-box'>
        {uploadSuccess && (
          <Typography variant='body1' color="green">
            <CheckCircleOutlineIcon className='circle' /> Upload complete. Check Your Mobile App for further steps
          </Typography>
        )}
      </div>
      <button onClick={uploadFile} disabled={uploading || !currentProject} className="upload-button">
        {uploading ? 'Uploading...' : `Upload ${type}`}
      </button>
    </Box>
  );
};

const Sidebar = ({ id,projects, setProjects,currentProject, setCurrentProject }) => {
  
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const Logout = () => {
    logout(); 
    navigate('/auth'); 
  }

  const [newProject, setNewProject] = useState('');
  
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase  
        .from('project')
        .select('*')
        .eq('user_id', id);
        //console.log(id);
        //console.log(data);
      if (error) {
        //console.error('Error fetching project mappings:', error.message);
        return;
      }
      
      setProjects(data.map(project => project));
    };

    fetchProjects();
  }, [id]);

  const addProject = async () => {
    const { data, error } = await supabase
      .from('project')
      .insert([{ project_name: newProject, user_id: id }]).select();

    if (error) {
      //console.error('Error adding new project:',data, error.message);
      return;
    }

    setProjects([...projects, data[0]]);
    setNewProject('');
    setCurrentProject(newProject);
    //console.log("data", data);
  
  };

  const deleteProject = async (projectId) => {
    const { error } = await supabase
      .from('project')
      .delete()
      .eq('project_id', projectId);

    if (error) {
      //console.error('Error deleting project:', error.message);
      return;
    }
    setProjects(projects.filter(project => project.project_id !== projectId));
    if (currentProject.project_id === projectId) {
      setCurrentProject(projects.length > 1 ? projects[0] : null);
    }
  };

  return (
    <div className="sidebar">
      <img className='image-logo' src='https://bbzeapqhbmyrggqphapv.supabase.co/storage/v1/object/public/callsheets/Frame_167_2__1_.jpg' />
      <p className='mid-head'>My Projects</p>
      <List className='list'>
        {projects.map((project, index) => (
          <ListItem button key={index} onClick={() => setCurrentProject(project)} className="project-item" style={{
            backgroundColor: currentProject.project_id === project.project_id ? 'white' : 'inherit',
            color: currentProject.project_id === project.project_id ? '#FC4E00' : 'inherit',
            fontWeight: currentProject.project_id === project.project_id ? 'bold' : 'inherit'
          }}>
            <ListItemText primary={project.project_name}  className='list-item'/>
            <button className="delete-button" onClick={() => deleteProject(project.project_id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <DeleteIcon />
            </button>
          </ListItem>
        ))}
      </List>
      <input
        label="New Project"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        fullwidth="true"
        className="project-input"
      />
      <button onClick={addProject} className="add-project-button">Add Project</button>
      <button className='logout' onClick={Logout}>Logout</button>
    </div>
  );
};

const Upload = () => {
  const location = useLocation();
  const { phoneNumber,id,name,email,project_id,callsheet_id } = location.state || {};

  const [projects, setProjects] = useState([]);
  const [projectsInit, setProjectsInit] = useState(false);
  
  const [currentProject, setCurrentProject] = useState('');

  const Id = id;
  

  useEffect(() => {
    if (projects.length > 0 & projectsInit===false) {
      setCurrentProject(projects[0]);
      setProjectsInit(true);
    }
  }, [projects,projectsInit]);
  //console.log(currentProject)
  //console.log(projects);

  return (
    <Container className="container">
      <Grid container spacing={3}>
        <Grid item xs={3}>
        <Sidebar id={Id} projects={projects} currentProject={currentProject} setProjects={setProjects} setCurrentProject={setCurrentProject} />
        </Grid>
        <Grid item xs={8.5}>
          <p className='right-heading'>
          Upload Script, Schedule, Cast & Crew directly from your web dashboard
          </p>
          <p className='right-sub'>
          Create projects, upload scripts, schedule shoots, and cast talent effortlessly from your web app. 
          </p>
          <p className='right-sub'>
          Access AI-optimized scenes, schedules, and crew lists on the go via our intuitive mobile app
          </p>
          <div className='upload-folder'>
          <FileUpload type="Script" currentProject={currentProject}  />
          <FileUpload1 type="Shoot Schedule" currentProject={currentProject} />

          <CrewUpload type="Crew" currentProject={currentProject} />
          <CastUpload type="Cast" currentProject={currentProject} />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Upload;
