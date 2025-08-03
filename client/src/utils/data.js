import Thumbnail1 from '../assets/flag1.jpg'
import Thumbnail2 from '../assets/flag2.jpg'
import Thumbnail3 from '../assets/flag3.png'
import Candidate1 from '../assets/candidate1.jpg'
import Candidate2 from '../assets/candidate2.jpg'
import Candidate3 from '../assets/candidate3.jpg'
import Candidate4 from '../assets/candidate4.jpg'
import Candidate5 from '../assets/candidate5.jpg'
import Candidate6 from '../assets/candidate6.jpg'
import Candidate7 from '../assets/candidate7.jpg'



export const elections=[
    {
        id:"e1",
        title:"Member Of Parliament 2025",
        description:"The election is a democratic process where citizens vote to choose leaders or decide policies. It ensures representation, accountability, and the peaceful transfer of power in a functioning democracy.",
        thumbnail:Thumbnail1,
        candidates:["c1","c2","c3","c4"],
        voters:[]
    },
    {
        id:"e2",
        title:"M.L.A 2025",
        description:"The election is a democratic process where citizens vote to choose leaders or decide policies. It ensures representation, accountability, and the peaceful transfer of power in a functioning democracy.",
        thumbnail:Thumbnail2,
        candidates:["c5","c6","c7"],
        voters:[]
    },
    {
        id:"e3",
        title:"Student Union President 2025",
        description:"The election is a democratic process where citizens vote to choose leaders or decide policies. It ensures representation, accountability, and the peaceful transfer of power in a functioning democracy.",
        thumbnail:Thumbnail3,
        candidates:[],
        voters:[]
    },
]


export const candidates = [
  {
    id: "c1",
    fullName: "Rohan Singh",
    motto: "For a stronger tomorrow",
    voteCount: 23,
    election: "e1",
    image: Candidate1
  },
  {
    id: "c2",
    fullName: "Priya Mehra",
    motto: "Empowering the people",
    voteCount: 18,
    election: "e1",
    image: Candidate2
  },
  {
    id: "c3",
    fullName: "Arjun Yadav",
    motto: "Transparency and growth",
    voteCount: 12,
    election: "e1",
    image: Candidate3
  },
  {
    id: "c4",
    fullName: "Neha Sharma",
    motto: "Unity and progress",
    voteCount: 9,
    election: "e1",
    image: Candidate4
  },
  {
    id: "c5",
    fullName: "Aman Verma",
    motto: "Together for change",
    voteCount: 21,
    election: "e2",
    image: Candidate5
  },
  {
    id: "c6",
    fullName: "Divya Patel",
    motto: "Voice of the people",
    voteCount: 17,
    election: "e2",
    image: Candidate6
  },
  {
    id: "c7",
    fullName: "Siddharth Rao",
    motto: "Fairness and development",
    voteCount: 14,
    election: "e2",
    image: Candidate7
  },
  {
    id: "c8",
    fullName: "Sneha Kapoor",
    motto: "Student first, always",
    voteCount: 25,
    election: "e3",
    image: Candidate1
  },
  {
    id: "c9",
    fullName: "Rahul Deshmukh",
    motto: "Your voice, my mission",
    voteCount: 19,
    election: "e3",
    image: Candidate2
  },
  {
    id: "c10",
    fullName: "Tanya Joshi",
    motto: "Lead with vision",
    voteCount: 22,
    election: "e3",
    image: Candidate3
  }
  
];

export const voters = [
  {
    id: "v1",
    fullName: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    isAdmin: true,
    votedElections: ["e2"]
  },
  {
    id: "v2",
    fullName: "Ritika Jain",
    email: "ritika.jain@gmail.com",
    password: "pass1234",
    isAdmin: false,
    votedElections: ["e1"]
  },
  {
    id: "v3",
    fullName: "Karan Mehta",
    email: "karan.mehta@gmail.com",
    password: "password123",
    isAdmin: false,
    votedElections: []
  },
  {
    id: "v4",
    fullName: "Anjali Rao",
    email: "anjali.rao@gmail.com",
    password: "anjali456",
    isAdmin: false,
    votedElections: ["e3"]
  },
  {
    id: "v5",
    fullName: "Mohit Kumar",
    email: "mohit.kumar@gmail.com",
    password: "mohit789",
    isAdmin: false,
    votedElections: ["e1", "e2"]
  }
];
