import {
    amin_bashiri,
    amin_fadaeinejad,
    amin_shamshiri,
    fateme_pourghasem,
    sanaz_naseribonari,
    yasaman_parhizkar,
} from "../../assets";

export interface SpeakerData {
    id: number;
    name: string;
    title: string;
    biography: string;
    photo: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    tedUrl?: string;
}

export const speakers: SpeakerData[] = [
    {
        id: 1,
        name: 'Yasaman Parhizkar',
        title: 'Data Scientist @ RBC',
        biography: 'Team member biography',
        photo: yasaman_parhizkar,
        linkedinUrl: "https://www.linkedin.com/in/yasamanparhizkar/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 2,
        name: 'Sanaz Naseribonari',
        title: 'Data Scientist @ Mitacs',
        biography: 'Team member biography',
        photo: sanaz_naseribonari,
        linkedinUrl: "https://www.linkedin.com/in/sanaz-naseribonari-902171142/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 3,
        name: 'Amin Bashiri',
        title: 'Senior Software Engineer @ Lyft',
        biography: 'Team member biography',
        photo: amin_bashiri,
        linkedinUrl: "https://www.linkedin.com/in/ma-shamshiri/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 4,
        name: 'Amin Shamshiri',
        title: 'Full-Stack Developer @ EnerZam',
        biography: 'Team member biography',
        photo: amin_shamshiri,
        linkedinUrl: "https://www.linkedin.com/in/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 5,
        name: 'Amin Fadaeinejad',
        title: 'ML Researcher @ Huawei',
        biography: 'Team member biography',
        photo: amin_fadaeinejad,
        linkedinUrl: "https://www.linkedin.com/in/amin-fadaeinejad/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 6,
        name: 'Fateme Pourghasem',
        title: 'Data Analyst @ CIHI',
        biography: 'Team member biography',
        photo: fateme_pourghasem,
        linkedinUrl: "https://www.linkedin.com/in/fpourghasem/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 7,
        name: 'Yasaman Parhizkar',
        title: 'Data Scientist @ RBC',
        biography: 'Team member biography',
        photo: yasaman_parhizkar,
        linkedinUrl: "https://www.linkedin.com/in/yasamanparhizkar/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 8,
        name: 'Sanaz Naseribonari',
        title: 'Data Scientist @ Mitacs',
        biography: 'Team member biography',
        photo: sanaz_naseribonari,
        linkedinUrl: "https://www.linkedin.com/in/sanaz-naseribonari-902171142/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 9,
        name: 'Amin Bashiri',
        title: 'Senior Software Engineer @ Lyft',
        biography: 'Team member biography',
        photo: amin_bashiri,
        linkedinUrl: "https://www.linkedin.com/in/aminbashiri/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 10,
        name: 'Amin Shamshiri',
        title: 'Full-Stack Developer @ EnerZam',
        biography: 'Team member biography',
        photo: amin_shamshiri,
        linkedinUrl: "https://www.linkedin.com/in/ma-shamshiri/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 11,
        name: 'Amin Fadaeinejad',
        title: 'ML Researcher @ Huawei',
        biography: 'Team member biography',
        photo: amin_fadaeinejad,
        linkedinUrl: "https://www.linkedin.com/in/amin-fadaeinejad/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },
    {
        id: 12,
        name: 'Fateme Pourghasem',
        title: 'Data Analyst @ CIHI',
        biography: 'Team member biography',
        photo: fateme_pourghasem,
        linkedinUrl: "https://www.linkedin.com/in/fpourghasem/",
        instagramUrl: "https://www.instagram.com/",
        tedUrl: "https://www.ted.com/"
    },

    // add more speakers here
];