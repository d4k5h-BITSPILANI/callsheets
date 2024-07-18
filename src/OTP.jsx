  import React, { useState, useContext, useEffect } from 'react';
  import axios from 'axios';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { AuthContext } from './AuthContext';  
  import './OTP.css';

  const OTP = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [otp, setOtp] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { phoneNumber,id,name,email,project_id,callsheet_id } = location.state || {};

    
    const verifyOTP = async () => {
      if (otp.length !== 6) {
        alert("Please enter a valid 6-digit OTP.");
        return;
      }
      setIsButtonDisabled(true);

      const payload = {
        is_accepted: "true",
        isd_code: "+91",
        otp: otp,
        username: phoneNumber,
      };

      try {
        await axios.post('https://prod-fbm-auth-service.ashymeadow-b2171eb1.centralindia.azurecontainerapps.io/auth-service/authentication', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://myfilmapp.com',
            'Referer': 'https://myfilmapp.com/',
          }
        });
        login();  
        navigate('/upload',{ state: { phoneNumber,id,name,project_id,callsheet_id,email } });  
      } catch (error) {

          alert('Error verifying OTP');
          setIsButtonDisabled(false);
          return;
        
      }
    };
    useEffect(() => {
      const handleKeyPress = (event) => {
          if (event.key === 'Enter' && phoneNumber.length === 10) {
            verifyOTP();
          }
      };

      // Attach the event listener to the document
      document.addEventListener('keydown', handleKeyPress);

      // Cleanup the event listener when the component unmounts
      return () => {
          document.removeEventListener('keydown', handleKeyPress);
      };
  }, [otp]); 

  useEffect(() => {
    const handleNavigate = () => {
      setIsButtonDisabled(false);
    };

    // Re-enable button if user navigates back to this page
    window.addEventListener('popstate', handleNavigate);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handleNavigate);
    };
  }, []);


    return (
      <div className="container">
        <div className="left-container">
        <img src='https://bbzeapqhbmyrggqphapv.supabase.co/storage/v1/object/public/callsheets/WhatsApp_Image_2024-06-10_at_00.15.48_fca40442.jpg' alt="Descriptive Alt Text" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="right1-container">
          <h1 className='heading'>Verification Code</h1>
          <p className='paragraph2'>We have sent the verification</p>
          <p className='paragraph2'>code to your mobile number</p>
          <p className='paragraph3'>+91 {phoneNumber}</p>
          
          <div className='model'>
            <div className='phone-input'>
            <input
            className='input1'
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
          />
            </div>
          <button className='henry' onClick={verifyOTP} disabled={isButtonDisabled}
          style={{ backgroundColor: isButtonDisabled ? 'grey' : '#FC4E00' }}>Continue</button>
          <div className='code-receiver'>
          <p className='paragraph2'>Didn't receive code?</p>
          <p className='please' onClick={() =>{
            navigate('/auth')
          }}>Request Again</p>
          </div>
          </div>
        </div>
      </div>
    );
  };

  export default OTP;
