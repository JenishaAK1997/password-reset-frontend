import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Form, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [formData, setFormData] = useState({
    signIn: { username: '', password: '' },
    signUp: { email: '', password: '' },
    resetPassword: { email: ''},
    updatePassword:{email:'',newpassword: '' },
    message:{noti:''}
  });

  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);




  const gentoken = async (event) => {
    event.preventDefault(); 
    try {
      const { email } = formData.resetPassword;

      const response = await fetch('http://localhost:4000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if(result.success){
          handleInputChange("message","noti","Reset link sent to your mail")
        }
        // Handle success, e.g., show a success message to the user
      } else {
        const errorResult = await response.json();
        console.error('Generate token failed:', errorResult.message);
        // Handle failure, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle unexpected errors
    }
  };


const [rs,setrs]=useState(false);
  const handleResetPassword = async (email, token) => {
    try {
      const response = await fetch('http://localhost:4000/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, resetToken: token }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        if(result.success){
         
          setrs(true)
          setResetPasswordVisible(true)

          handleInputChange("message","noti","Reset link sent to your mail")
        }
        // Handle success, e.g., show a success message to the user
      } else {
        const errorResult = await response.json();
        console.error('Reset password failed:', errorResult.message);
        // Handle failure, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle unexpected errors
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault(); 
    try {
      const { username, password } = formData.signIn;
const email=username
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        handleInputChange("message","noti","logged in successfully")
        const result = await response.json();
        console.log(result.success);
        // Handle success, e.g., store user data in state or navigate to another page
      } else {
        const errorResult = await response.json();
        handleInputChange("message","noti","logged in failed")
        console.error('Sign in failed:', errorResult.message);
        // Handle failure, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle unexpected errors
    }
  };


  const handleSignUp = async () => {
    try {
      const { email, password } = formData.signUp;

      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if(result.message==="Registration successful"){
          handleInputChange("signUp","","")
    
            handleInputChange("message","noti","New user registered")
        }
   
        // Handle success, e.g., show a success message to the user
      } else {
        const errorResult = await response.json();
        console.error('Sign up failed:', errorResult.message);
        // Handle failure, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle unexpected errors
    }
  };




  useEffect(() => {
    const fullPath = window.location.pathname;
    const lastPart = fullPath.substring(fullPath.lastIndexOf('/') + 1);

    const params = new URLSearchParams(window.location.search);

    // Extract the values for 'm' and 'x' parameters
    const email = params.get('m');
    const token = params.get('x');

    // Check if both parameters are present
    if (email && token) {
      // Perform actions with the parameters, for example, log them
      handleResetPassword(email, token);



 }
}
  , []);

  const handleInputChange = (formType, field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [formType]: { ...prevFormData[formType], [field]: value },
    }));
  };

  const handleTabChange = (key) => {
    if (key === 'resetPassword') {
      setResetPasswordVisible(true);
    } else {
      setResetPasswordVisible(false);
    }
  };

  const handleResetLinkClick = () => {
    setResetPasswordVisible(true);
  };
  const updatePassword = async (event) => {
    event.preventDefault(); 
    try {
      const { email, newpassword } = formData.updatePassword;
      const response = await fetch('http://localhost:4000/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newpassword }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if(result.success){
          handleInputChange("message","noti","Password changed successfully")
        }
        // Handle success, e.g., show a success message to the user
      } else {
        const errorResult = await response.json();
        console.error('Reset password failed:', errorResult.message);
        // Handle failure, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle unexpected errors
    }
  };
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle the sign-up form submission
    // For example, you can send a request to your backend API
    console.log('Sign Up form submitted:', formData.signUp);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Container>
        {formData.message.noti}
        <div className="auth-box p-4 shadow">
          <Tabs defaultActiveKey={(resetPasswordVisible && rs) ? "resetPassword" : "signIn"} onSelect={handleTabChange}>
            <Tab eventKey="signIn" title={<span><FontAwesomeIcon icon={faSignInAlt} /> Sign In</span>}>
              <Form>
                <Form.Group controlId="formSignInUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={formData.signIn.username}
                    onChange={(e) => handleInputChange('signIn', 'username', e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formSignInPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={formData.signIn.password}
                    onChange={(e) => handleInputChange('signIn', 'password', e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit"  onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button variant="link" onClick={handleResetLinkClick} className="mt-3">
                  Forgot your password? Reset it here.
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="signUp" title={<span><FontAwesomeIcon icon={faUserPlus} /> Sign Up</span>}>
              <Form onSubmit={handleSignUpSubmit}>
                <Form.Group controlId="formSignUpEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={formData.signUp.email}
                    onChange={(e) => handleInputChange('signUp', 'email', e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formSignUpPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={formData.signUp.password}
                    onChange={(e) => handleInputChange('signUp', 'password', e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSignUp}>
                  Sign Up
                </Button>
              </Form>
            </Tab>
            {resetPasswordVisible && (
              <Tab eventKey="resetPassword" title={<span><FontAwesomeIcon icon={faKey} /> Reset Password</span>}>
                <Form>
                {!rs&&  <Form.Group controlId="formResetPasswordEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter email"
                      value={formData.resetPassword.email}
                      onChange={(e) => handleInputChange('resetPassword', 'email', e.target.value)}
                    />
                  </Form.Group>}
             {rs&&  <div> 
              
              <Form.Group controlId="formResetPasswordEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter email"
                      value={formData.updatePassword.email}
                      onChange={(e) => handleInputChange('updatePassword', 'email', e.target.value)}
                    />
                  </Form.Group>
              
              <Form.Group controlId="formResetPasswordText">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter text"
                      value={formData.resetPassword.text}
                      onChange={(e) => handleInputChange('updatePassword', 'newpassword', e.target.value)}
                    />
                  </Form.Group>
                      <Button variant="primary" type="submit" onClick={updatePassword}>
                      update Password
                    </Button></div>  
                  }
                  {!rs&&
                  <Button variant="primary" type="submit" onClick={gentoken}>
                    reset Password
                  </Button>}
                </Form>
              </Tab>
            )}
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default App;
