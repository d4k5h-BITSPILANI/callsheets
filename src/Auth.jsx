import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; 

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://bbzeapqhbmyrggqphapv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiemVhcHFoYm15cmdncXBoYXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NTY0MjUsImV4cCI6MjAyNTIzMjQyNX0.3a9JTgNQ6-atB9XgrRZeOfl-vP6E4hp_ajzm3xGRYDc'
const supabase = createClient(supabaseUrl, supabaseKey)

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const requestOTP = async () => {
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
            
      let { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('phone', phoneNumber)
      
//      console.log('Query result:', data, 'Error:', error);

      if (error) {
        console.error('Error querying Supabase:', error);
        alert("An error occurred while checking the user.");
        return;
      }
      if (!data || data==null|| data.length===0) {
        alert("First create a user by logging in through the phone app");
        return;
      }

      const user = data[0];
  //    console.log('Query result:', user);

      const payload = {
        isd_code: "+91",
        username: phoneNumber,
        is_terms_accepted: true
      };

      await axios.post('https://services.myfilmapp.com/auth-service/authentication/otp', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://myfilmapp.com',
          'Referer': 'https://myfilmapp.com/',
        }
      });

      navigate('/auth/otp', { state: { 
        phoneNumber,
        id: user.id,
        name: user.name,
        project_id: user.project_id,
        callsheet_id: user.callsheet_id,
        email:user.email
      } });
    } catch (error) {
   //   console.error('Error requesting OTP:', error);
    }
  };

  return (
    <div className="container">
      <div className="left-container">
      <img src='https://bbzeapqhbmyrggqphapv.supabase.co/storage/v1/object/public/callsheets/WhatsApp_Image_2024-06-10_at_00.15.48_fca40442.jpg' alt="Descriptive Alt Text" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="right-container">
        <p className='paragraph2'>To Create Projects & Upload Scripts</p>
        <h1 className='heading'>Let's Sign you in</h1>
        <p className='paragraph1'>Mobile Number</p>
        <div className='model'>
          <div className='phone-input'>
          <span className="country-code">+91</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter Mobile Number"
            maxLength="10"
          />
          </div>
        <button onClick={requestOTP}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
