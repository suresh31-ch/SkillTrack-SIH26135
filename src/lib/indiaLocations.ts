export interface StateWithDistricts {
  state: string;
  districts: string[];
}

export const INDIA_STATES_AND_DISTRICTS: StateWithDistricts[] = [
  {
    state: 'Andhra Pradesh',
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 
      'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 
      'Kakinada', 'YSR Kadapa', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 
      'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 
      'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari'
    ]
  },
  {
    state: 'Arunachal Pradesh',
    districts: [
      'Anjaw', 'Changlang', 'East Kameng', 'East Siang', 'Kamle', 'Kurung Kumey', 
      'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 
      'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 
      'Siang', 'Tawang', 'Tirap', 'Upper Dibang Valley', 'Upper Siang', 
      'Upper Subansiri', 'West Kameng', 'West Siang', 'Itanagar Capital Complex'
    ]
  },
  {
    state: 'Assam',
    districts: [
      'Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 
      'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 
      'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 
      'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 
      'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 
      'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ]
  },
  {
    state: 'Bihar',
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 
      'Buxar', 'Darbhanga', 'East Champaran (Motihari)', 'Gaya', 'Gopalganj', 'Jamui', 
      'Jehanabad', 'Kaimur (Bhabua)', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 
      'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 
      'Purnia (Purnea)', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 
      'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran (Bettiah)'
    ]
  },
  {
    state: 'Chhattisgarh',
    districts: [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 
      'Bilaspur', 'Dantewada (South Bastar)', 'Dhamtari', 'Durg', 'Gariyaband', 
      'Gaurela Pendra Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham (Kawardha)', 
      'Kanker (North Bastar)', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba', 
      'Korea (Koriya)', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur(MCB)', 'Mohla-Manpur-Ambagarh Chowki', 
      'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sakti', 'Sarangarh-Bilaigarh', 
      'Sukma', 'Surajpur', 'Surguja'
    ]
  },
  {
    state: 'Goa',
    districts: ['North Goa', 'South Goa']
  },
  {
    state: 'Gujarat',
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 
      'Botad', 'Chhotaudepur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 
      'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda', 'Mahisagar', 'Mehsana', 
      'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 
      'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
    ]
  },
  {
    state: 'Haryana',
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 
      'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Narnaul (Mahendragarh)', 
      'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
    ]
  },
  {
    state: 'Himachal Pradesh',
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 
      'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ]
  },
  {
    state: 'Jharkhand',
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 
      'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 
      'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahebganj', 
      'Seraikela-Kharsawan', 'Simdega', 'West Singhbhum'
    ]
  },
  {
    state: 'Karnataka',
    districts: [
      'Bagalkot', 'Ballari (Bellary)', 'Belagavi (Belgaum)', 'Bengaluru (Bangalore) Rural', 
      'Bengaluru (Bangalore) Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapura', 
      'Chikkamagaluru (Chikmagalur)', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 
      'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi (Gulbarga)', 'Kodagu', 
      'Kolar', 'Koppal', 'Mandya', 'Mysuru (Mysore)', 'Raichur', 'Ramanagara', 
      'Shivamogga (Shimoga)', 'Tumakuru (Tumkur)', 'Udupi', 'Uttara Kannada (Karwar)', 
      'Vijayapura (Bijapur)', 'Yadgir'
    ]
  },
  {
    state: 'Kerala',
    districts: [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 
      'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 
      'Thrissur', 'Wayanad'
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 
      'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 
      'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)', 
      'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa (East Nimar)', 'Khargone (West Nimar)', 
      'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 
      'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 
      'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 
      'Umaria', 'Vidisha'
    ]
  },
  {
    state: 'Maharashtra',
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Beed', 
      'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
      'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 
      'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar', 
      'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 
      'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ]
  },
  {
    state: 'Manipur',
    districts: [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 
      'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 
      'Tengnoupal', 'Thoubal', 'Ukhrul'
    ]
  },
  {
    state: 'Meghalaya',
    districts: [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 
      'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 
      'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ]
  },
  {
    state: 'Mizoram',
    districts: [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 
      'Mamit', 'Saitual', 'Serchhip', 'Siaha'
    ]
  },
  {
    state: 'Nagaland',
    districts: [
      'Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 
      'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto'
    ]
  },
  {
    state: 'Odisha',
    districts: [
      'Angul', 'Balangir', 'Balasore (Baleswar)', 'Bargarh', 'Bhadrak', 'Boudh', 
      'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 
      'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar (Keonjhar)', 
      'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 
      'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur (Sonepur)', 'Sundargarh'
    ]
  },
  {
    state: 'Punjab',
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 
      'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 
      'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar (Ropar)', 
      'Mohali (SAS Nagar)', 'Sangrur', 'Shaheed Bhagat Singh Nagar (Nawanshahr)', 
      'Tarn Taran'
    ]
  },
  {
    state: 'Rajasthan',
    districts: [
      'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 
      'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 
      'Dausa', 'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu', 'Dungarpur', 'Ganganagar', 
      'Hanumangarh', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 
      'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara', 
      'Kota', 'Nagaur', 'Neem ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 
      'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 
      'Tonk', 'Udaipur'
    ]
  },
  {
    state: 'Sikkim',
    districts: ['Gangtok', 'Gyalsing (West Sikkim)', 'Mangan (North Sikkim)', 'Namchi (South Sikkim)', 'Pakyong', 'Soreng']
  },
  {
    state: 'Tamil Nadu',
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 
      'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur', 
      'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 
      'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 
      'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi (Tuticorin)', 'Tiruchirappalli', 
      'Tirunelveli', 'Tirupattur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 
      'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ]
  },
  {
    state: 'Telangana',
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 
      'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 
      'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 
      'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 
      'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ]
  },
  {
    state: 'Tripura',
    districts: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura']
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi (Chatrapati Sahuji Mahraj Nagar)', 
      'Amroha (J.P. Nagar)', 'Auraiya', 'Ayodhya (Faizabad)', 'Azamgarh', 'Baghpat', 
      'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 
      'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 
      'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 
      'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur (Panchsheel Nagar)', 
      'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 
      'Kanpur Nagar', 'Kasganj (Kanshiram Nagar)', 'Kaushambi', 'Kushinagar (Padrauna)', 
      'Lakhimpur - Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 
      'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 
      'Pratapgarh', 'Prayagraj (Allahabad)', 'RaeBareli', 'Rampur', 'Saharanpur', 
      'Sambhal (Bhim Nagar)', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 
      'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
    ]
  },
  {
    state: 'Uttarakhand',
    districts: [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 
      'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 
      'Udham Singh Nagar', 'Uttarkashi'
    ]
  },
  {
    state: 'West Bengal',
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur (South Dinajpur)', 
      'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 
      'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman (West Burdwan)', 
      'Paschim Medinipur (West Midnapore)', 'Purba Bardhaman (East Burdwan)', 'Purba Medinipur (East Midnapore)', 
      'Purulia', 'South 24 Parganas', 'Uttar Dinajpur (North Dinajpur)'
    ]
  },
  {
    state: 'Andaman and Nicobar Islands',
    districts: ['Nicobar', 'North and Middle Andaman', 'South Andaman']
  },
  {
    state: 'Chandigarh',
    districts: ['Chandigarh']
  },
  {
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    districts: ['Dadra and Nagar Haveli', 'Daman', 'Diu']
  },
  {
    state: 'Delhi',
    districts: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi']
  },
  {
    state: 'Jammu and Kashmir',
    districts: [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 
      'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 
      'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
    ]
  },
  {
    state: 'Ladakh',
    districts: ['Kargil', 'Leh']
  },
  {
    state: 'Lakshadweep',
    districts: ['Agatti', 'Amini', 'Andrott', 'Bithra', 'Chetlat', 'Kadavanthra', 'Kalpeni', 'Kavaratti', 'Minicoy', 'Androth']
  },
  {
    state: 'Puducherry',
    districts: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam']
  }
];

export function getDistrictsForState(stateName: string): string[] {
  const found = INDIA_STATES_AND_DISTRICTS.find(s => s.state.toLowerCase() === stateName.toLowerCase());
  return found ? found.districts : [];
}
