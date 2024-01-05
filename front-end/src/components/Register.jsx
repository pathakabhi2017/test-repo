import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Register = () => {
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [phone, setPhone] = useState();
	const navigate = useNavigate();
	const onSubmitHandler = async () => {
		if (!name || !email || !phone) {
			toast.error("All fields is required!")
		} else if (!email.includes('@') || email.length < 5) {
			toast.error("Please enter valid email!")
		}
		else {
			const { data } = await axios.post('/api/v2/registeruser', {
				name: name,
				email: email,
				phone: phone
			})
			console.log(data)
			if (data.success) {
				toast.success(data.message)
				navigate(`/loginWithPhone`)
			}
			else {
				toast.error(data.message)
			}
		}
	}

	useEffect(() => {

	}, [])
	return (
		<>

			<div class="otp_wraper">
				<div class="otp_form">
					<div class="logo_otp text-center">
						<a target="_blank" href="#">
							<img
								width="170"
								src="images/inbound-academy-logo.webp"
								alt="Logo"
							/>
						</a>
					</div>
					<div class="otp_content text-center">
						<h3>Verify Mobile</h3>

						<p>
							Please provide the WhatsApp Mobile Number
						</p>
						<div className=''>
							<input
								className="inputfield"
								defaultValue={name}
								type="text"
								placeholder="Enter Name here*"
								required
								onChange={(e) => setName(e.target.value)}
							/>
							<br />

						</div>
						<div className=''>
							<input
								defaultValue={email}
								className="inputfield"
								type="text"
								placeholder="Enter Email here*"
								required
								onChange={(e) => setEmail(e.target.value)}
							/>
							<br />

						</div>

						<div className=' '>
							<input
								defaultValue={phone}
								className="inputfield"
								type="text"
								placeholder="Enter Phone Number here*"
								required
								onChange={(e) => setPhone(e.target.value)}
							/>

						</div>

					</div>
					<div class="otp_resend text-center">

						<button className="btn" onClick={onSubmitHandler}>
							Submit
						</button>
						<p>
							<h5>Already Register Login Here</h5>
							<Link className="btn" to={'/loginWithPhone'} style={{ textDecoration: 'none', fontWeight: '600' }}> Login</Link>
						</p>


					</div>
				</div>
			</div>

		</>
	);
}

export default Register;







