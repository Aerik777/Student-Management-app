import Image from 'next/image';

<Image 
  src={student.profilePic} 
  alt="Student" 
  width={150} 
  height={150} 
  placeholder="blur" // Prevents layout shift
  className="rounded-full"
/>