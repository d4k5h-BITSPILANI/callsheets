  import React, { useState, useContext, useEffect } from 'react';
  import axios from 'axios';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { AuthContext } from './AuthContext';  
  import './OTP.css';

  const OTP = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill('')); // Initialize with empty strings for each digit;
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { phoneNumber,id,name,email,project_id,callsheet_id } = location.state || {};

    const handleChange = (value, index) => {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value.length === 1 && index < 5) {
        // Automatically focus next input
        document.getElementById(`otp-${index + 1}`).focus();
      }
    };

  const verifyOTP = async () => {
    const fullOTP = otp.join('');
    if (fullOTP.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsButtonDisabled(true);
    const payload = {
      is_accepted: "true",
      isd_code: "+91",
      otp: fullOTP,
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
      navigate('/upload', { state: { phoneNumber, id, name, project_id, callsheet_id, email } });
    } catch (error) {
      alert('Error verifying OTP');
      setIsButtonDisabled(false);
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
    // Verify OTP automatically when all digits are filled
    const fullOTP = otp.join('');
    if (fullOTP.length === 6) {
      verifyOTP();
    }
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
        <img width='300px' src='https://bbzeapqhbmyrggqphapv.supabase.co/storage/v1/object/public/callsheets/WhatsApp_Image_2024-06-10_at_00.15.48_fca40442.jpg' alt="Descriptive Alt Text" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="right1-container">
          <h1 className='heading'>Verification Code</h1>
          <p className='paragraph2'>We have sent the verification code to your</p>
          <p className='paragraph2'> mobile number</p>
          <p className='paragraph3'>+91 {phoneNumber}</p>
          
          <div className='model'>
          <div className='phone-input'>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                className='input1'
                type="text"
                value={digit}
                maxLength="1"
                onChange={e => handleChange(e.target.value, index)}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button className='henry' onClick={verifyOTP} disabled={isButtonDisabled}
          style={{ backgroundColor: isButtonDisabled ? 'grey' : '#FC4E00' }}>Login</button>
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
