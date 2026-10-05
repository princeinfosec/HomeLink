/**
 * All-India States / Union Territories → Cities.
 * City names that already exist in HomeLink demo data keep their old ids
 * ("Delhi NCR", "Bangalore", "Mumbai", "Hyderabad", "Rewa") so filters keep working.
 */
export const INDIA_LOCATIONS = [
  { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kurnool', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Amaravati'] },
  { state: 'Arunachal Pradesh', cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Along', 'Tezu'] },
  { state: 'Assam', cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri', 'Diphu'] },
  { state: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Sasaram'] },
  { state: 'Chhattisgarh', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur'] },
  { state: 'Goa', cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Nadiad', 'Morbi', 'Mehsana', 'Bharuch', 'Vapi', 'Bhuj', 'Porbandar'] },
  { state: 'Haryana', cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Rohtak', 'Hisar', 'Sonipat', 'Yamunanagar', 'Panchkula', 'Bhiwani', 'Sirsa', 'Kurukshetra'] },
  { state: 'Himachal Pradesh', cities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Baddi', 'Hamirpur', 'Una', 'Bilaspur'] },
  { state: 'Jharkhand', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar'] },
  { state: 'Karnataka', cities: ['Bangalore', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere', 'Ballari', 'Shivamogga', 'Tumakuru', 'Udupi', 'Vijayapura', 'Hassan', 'Dharwad'] },
  { state: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad', 'Kottayam', 'Malappuram', 'Kasaragod', 'Idukki'] },
  { state: 'Madhya Pradesh', cities: ['Rewa', 'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Katni', 'Singrauli', 'Burhanpur', 'Khandwa', 'Chhindwara', 'Morena', 'Bhind', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur', 'Neemuch', 'Hoshangabad', 'Sehore', 'Betul', 'Seoni', 'Balaghat', 'Shahdol', 'Sidhi', 'Panna', 'Chhatarpur', 'Tikamgarh', 'Datia', 'Mandla', 'Dindori', 'Khargone', 'Barwani', 'Dhar', 'Jhabua', 'Rajgarh', 'Guna', 'Ashoknagar'] },
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Navi Mumbai', 'Kolhapur', 'Amravati', 'Nanded', 'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Satara', 'Ratnagiri', 'Pimpri-Chinchwad'] },
  { state: 'Manipur', cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul', 'Senapati'] },
  { state: 'Meghalaya', cities: ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Baghmara'] },
  { state: 'Mizoram', cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'] },
  { state: 'Nagaland', cities: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'] },
  { state: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda'] },
  { state: 'Punjab', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur', 'Moga', 'Firozpur', 'Phagwara', 'Kapurthala'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Sri Ganganagar', 'Pali', 'Bharatpur', 'Chittorgarh', 'Jaisalmer', 'Mount Abu', 'Tonk'] },
  { state: 'Sikkim', cities: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo'] },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Hosur', 'Kanyakumari', 'Kancheepuram', 'Tiruppur', 'Nagercoil'] },
  { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahabubnagar', 'Nalgonda', 'Adilabad', 'Siddipet', 'Secunderabad'] },
  { state: 'Tripura', cities: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia'] },
  { state: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Noida', 'Greater Noida', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Ayodhya', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Mirzapur', 'Raebareli', 'Sultanpur', 'Basti', 'Etawah', 'Sitapur', 'Hardoi', 'Unnao'] },
  { state: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital', 'Mussoorie', 'Almora', 'Pithoragarh'] },
  { state: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Kharagpur', 'Haldia', 'Darjeeling', 'Jalpaiguri', 'Cooch Behar', 'Krishnanagar', 'Baharampur'] },

  // Union Territories
  { state: 'Andaman and Nicobar Islands', cities: ['Port Blair', 'Diglipur', 'Mayabunder', 'Car Nicobar'] },
  { state: 'Chandigarh', cities: ['Chandigarh'] },
  { state: 'Dadra and Nagar Haveli and Daman and Diu', cities: ['Daman', 'Diu', 'Silvassa'] },
  { state: 'Delhi', cities: ['Delhi NCR', 'New Delhi', 'Dwarka', 'Rohini', 'Saket', 'Karol Bagh', 'Lajpat Nagar', 'Kamla Nagar', 'Janakpuri', 'Pitampura'] },
  { state: 'Jammu and Kashmir', cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Sopore', 'Pulwama'] },
  { state: 'Ladakh', cities: ['Leh', 'Kargil'] },
  { state: 'Lakshadweep', cities: ['Kavaratti', 'Agatti', 'Minicoy'] },
  { state: 'Puducherry', cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
].map((s) => ({ ...s, cities: [...s.cities].sort((a, b) => a.localeCompare(b)) }));

/** City → state lookup (first match wins). */
export const CITY_TO_STATE = INDIA_LOCATIONS.reduce((acc, s) => {
  s.cities.forEach((c) => {
    if (!acc[c]) acc[c] = s.state;
  });
  return acc;
}, {});

export const TOTAL_CITIES = INDIA_LOCATIONS.reduce((n, s) => n + s.cities.length, 0);
