const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.set(express.static('html/'));
app.set(express.static('faculty/'));
app.set(express.static('admins/'));
app.set(express.static('images/'));
const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const eventschema = new mongoose.Schema({
    title: String,
    description: String,
    name: String,
    phno: Number,
});
const eventmodel = mongoose.model('events', eventschema);
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    phone: Number,
    gender: String,
    dob: String,
    address: String,
    regno: Number,
    slot: Number,
    year: Number,
    dept:String,
    Resident: String
});
const markSchema = new mongoose.Schema({
    marks: Number,
    regno: Number,
    Subject: String
});

const timetableSchema = new mongoose.Schema({
    slot: Number,
    subject: String,
    period: Number,
    day:String
});
const teacherSchema = new mongoose.Schema({
    email: String,
    subject: String,
    password: String,
    slot: Number,
    cabin: Number,
    phone: Number,
    fid: Number,
    name: String
});
const UserModel = mongoose.model('users', userSchema);
const markmodel = mongoose.model('marks', markSchema);
const ttmodel = mongoose.model('timetables', timetableSchema);
const teachermodel = mongoose.model('faculty', teacherSchema);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index1.html');
});
app.get('/dashboard', function (req, res) {
    res.sendFile(__dirname + '/html/interface.html');
});
app.get('/grades', function (req, res) {
    res.sendFile(__dirname + '/html/marks.html');
});
app.get('/getdetails/:regno', async function (req, res) {
    var regno = Number(req.params.regno);
    console.log(regno);
    const user = await UserModel.findOne({ regno: regno });
    if (user) {
        return res.json({ success: true, user });
    } else {
        return res.json({ success: false, message: 'User not found' });
    }
});

app.get('/getdetails', async function (req, res) {
    return res.sendFile(__dirname + '/faculty/profile.html');
});
app.get('/events', function (req, res) {
    res.sendFile(__dirname + '/html/events.html');
});

app.get('/materials', function (req, res) {
    res.sendFile(__dirname + '/html/materials.html');
});
app.get('/facultymarks', function (req, res) {
    return res.sendFile(__dirname + '/faculty/marks.html');
});
app.get('/ttable', function (req, res) {
    return res.sendFile(__dirname + '/admins/timetable.html');
});
app.get('/ttable/:slot/:subject/:period/:day', async function (req, res) {
    console.log(req.params);
    var subject = req.params.subject;
    var period = Number(req.params.period);
    var slot = Number(req.params.slot);
    var day =req.params.day;
    const time = await ttmodel.findOne({ slot: slot, subject: subject ,period:period});
    if (time) {
        const time1 = await time.updateOne(
            {
                slot: slot,
                subject: subject,
                period: period,
                day: day
            }
        );
        return res.json({ success: true, message: 'Time Table Changed Successfully' });
    }
    else {
        const newUser = new ttmodel({
            slot: slot,
            subject: subject,
            period: period,
            day:day
        });
        try {
            const savedUser = await newUser.save();
            return res.json({ success: true, message: 'Time Table Updated Successfully' });
        } catch (err) {
            return res.json({ success: false, message: err.message });
        }
    }
});
app.get('/facultymarks/:reg/:subject/:marks/', async function (req, res) {
    var subject = req.params.subject;
    var marks = Number(req.params.marks);
    var reg = Number(req.params.reg);
    const newUser = new markmodel({
        Subject: subject,
        marks: marks,
        regno: reg
    });
    try {
        const savedUser = await newUser.save();
        return res.json({ success: true, message: savedUser });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
})
app.get('/login', function (req, res) {
    return res.sendFile(__dirname + '/html/login page.html');
});
app.get('/login/:email/:password', async function (req, res) {
    var email = req.params.email;
    var password = req.params.password;
    const user = await UserModel.findOne({ email: email, password: password });
    res.cookie('sid',email);
    if (user) {
        return res.json({ success: true, message: 'Already registered' });
    } else {
        return res.json({ success: false, message: 'failed' });
    }
});
app.get('/facultydetails', function (req, res) {
    res.sendFile(__dirname + '/html/facultydetails.html');
}); 
app.get('/fetchevents', async function (req, res) {
    try {
        const events = await eventmodel.find({});
        return res.json({ success: true, events });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

app.get('/fetchevents', async function (req, res) {
    const time = await eventmodel.findMany({});
    return res.json({ success: true, time });
});
app.get('/details', function (req, res) {
    res.sendFile(__dirname + '/html/details.html');
});
 
app.get('/timetable', function (req, res) {
    res.sendFile(__dirname + '/html/timetable.html');
});
app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/html/signup.html');
});
app.get('/signup/:email/:password', async function (req, res) {
    var email = req.params.email;
    var password = req.params.password;
    console.log(req.params)
    const user = await UserModel.findOne({ email: email });
    if (user) {
        return res.json({ success: false, message: 'Already registered' });
    } else {
        const newUser = new UserModel({
            email: email,
            password: password
        });
        try {
            const savedUser = await newUser.save();
            return res.json({ success: true, message: savedUser });
        } catch (err) {
            return res.json({ success: false, message: err.message });
        }
    }
});
app.get('/fevents', (req, res) => {
    return res.sendFile(__dirname + '/faculty/events.html')
});
app.get('/events/:title/:para/:name/:phno', async (req, res) => {
    var title = req.params.title;
    var para = req.params.para;
    var name = req.params.name;
    var phno = req.params.phno;
    const newUser = new eventmodel({
        title: title,
        description: para,
        name: name,
        phno: phno
    });
    try {
        const savedUser = await newUser.save();
        return res.json({ success: true, message: savedUser });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
});
app.get('/logout', async function (req, res) {
    return res.sendFile(__dirname + '/html/index1.html');
});
app.get('/log', async function (req, res) {
    return res.sendFile(__dirname + '/html/index1.html');
});
app.get('/interface', async function (req,res){
    return res.sendFile(__dirname + '/faculty/interface.html');
});
app.get('/teacher', async function (req,res){
    return res.sendFile(__dirname + '/admins/teacher.html');
});
app.get('/teacher/:email/:password/:slot/:cabin/:phone/:subject/:id/:name', async function (req,res){
    var email = req.params.email;
    var slot = req.params.slot;
    var phone = req.params.phone;
    var subject = req.params.subject;
    var id = req.params.id;
    var password = req.params.password;
    var cabin = req.params.cabin;
    var name = req.params.name;
    try{
        const new1= new teachermodel({
            email: email,
            slot: slot,
            subject: subject,
            fid:Number(id),
            password: password,
            phone:Number(phone),
            cabin:Number(cabin),
            name:name
        });
        const savedUser =await new1.save();
        return res.json({ success: true, message:'ok' });
    }catch(err){
        return res.json({ success: false, message: err.message });
    }
});
app.get('/student', async function (req,res){
    return res.sendFile(__dirname + '/admins/student.html');
});
app.get('/student/:email/:password/:slot/:gender/:year/:phone/:dept/:id/:address/:res/:dob/:name', async function (req,res){
    var email = req.params.email;
    var slot = req.params.slot;
    var phone = req.params.phone;
    var dept = req.params.dept;
    var id = req.params.id;
    var password = req.params.password;
    var year = req.params.year;
    var address = req.params.address;
    var resident = req.params.res;
    var gender = req.params.gender;
    var name = req.params.name;
    var dob = req.params.dob;
    console.log(req.params)
    try{
        const new1= new UserModel({
            email: email,
            slot: Number(slot),
            dept: dept,
            regno:Number(id),
            password: password,
            phone:Number(phone),
            year:Number(year),
            address:address,
            gender:gender,
            Resident:resident,
            name:name,
            dob:dob
        });
        const savedUser=await new1.save();
        return res.json({ success: true, message: savedUser });
    }catch (err) {
        return res.json({ success: false, message: err.message });
    }
});
app.get('/flogin',(req,res)=>{
    return res.sendFile(__dirname+'/faculty/login.html');
});
app.get('/flogin/:mail/:pass',async (req,res)=>{
    var email=req.params.mail;
    var password=req.params.pass;
    const user=await teachermodel.findOne({email:email,password:password});
    if(user){
        res.cookie('fid',user.email);
        return res.json({ success: true, message:'ok'});
    }
    else{
        return res.json({ success: false });
    }
});
app.get('/display',(req,res)=>{
    return res.sendFile(__dirname+'/faculty/display.html');
});
app.get('/fgetdetails',async (req,res)=>{
    var email=req.cookies.fid;
    var user=await teachermodel.findOne({email:email});
    return res.json({ success: true,user});
});
app.get('/sdisplay',async (req,res)=>{
    return res.sendFile(__dirname+'/html/display.html');
});
app.get('/sgetdetails',async (req,res)=>{
    var email=req.cookies.sid;
    var user=await UserModel.findOne({email:email});
    return res.json({ success: true,user});
});
app.get('/tt',async (req,res)=>{
    return res.sendFile(__dirname+'/html/timetable.html');
});
app.get('/fetchtt',async (req,res)=>{
    var email=req.cookies.sid;
    var user=await UserModel.findOne({email:email});
    var s=user.slot;
    var data1=await ttmodel.find({slot:s});
    return res.json({ success:true,data1});
});
app.get('/ff',async (req,res)=>{
    return res.sendFile(__dirname+'/faculty/timetable.html');
});
app.get('/fftable',async (req,res)=>{
    var email=req.cookies.fid;
    var user=await teachermodel.findOne({email:email});
    var s=user.slot;
    var data1=await ttmodel.find({slot:s,subject:user.subject});
    return res.json({ success:true,data1});
});
app.get('/smm',async (req,res)=>{
    return res.sendFile(__dirname+'/html/marks.html');
});
app.get('/sm',async (req,res)=>{
    var email=req.cookies.sid;
    var user=await UserModel.findOne({email:email});
    var data1=await markmodel.find({regno:user.regno});
    return res.json({ success:true,data1});
});
app.get('/parent',async (req,res)=>{
    return res.sendFile(__dirname+'/html/parent/details.html');
});
app.post('/fgg',async (req,res)=>{
    var email=req.body.reg+'@klu.ac.in';
    res.cookie('sid',email);
    res.redirect('/smm');
});
app.get('/ffdetails',function(req,res){
    return res.sendFile(__dirname+'/html/facultydetails.html');
});
app.listen(3000, () => {
    console.log('Server is running');
});