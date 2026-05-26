// detailsPageData – statiske data om maskiner på en vaskelokation: vaskehaller, selvvask og støvsugere med status.
// Status kan være "Ledig", "Optaget" eller "Ud af drift" og bruges til at styre StartWashButton-knappens udseende.

export type Vaskehall = {
id: number;
image: string;
title: string;
status: string;
};

export type Vaskselv = {
id: number;
image: string;
title: string;
status: string;
};

export type Stovsuger = {
id: number;
image: string;
title: string;
status: string;
};




export const VaskehallDetails: Vaskehall[] = [
{
id: 1,
image:"/icons/EnkeltVaskIcon.png", 
title: "Vaskehall 1",
status: "Ledig",
},
{
id: 2,
image:"/icons/EnkeltVaskIcon.png", 
title: "Vaskehall 2",
status: "Optaget",
},
{
id: 3,
image:"/icons/EnkeltVaskIcon.png",
title: "Vaskehall 3",
status: "Ud af drift",
},];

export const VaskselvDetails: Vaskselv[] = [
{
id: 1,
image:"/icons/VaskSelvIcon.png",
title: "Vaskselv 1",
status: "Ledig",
},
{
id: 2,
image:"/icons/VaskSelvIcon.png",
title: "Vaskselv 2",
status: "Optaget",
},
{
id: 3,
image:"/icons/VaskSelvIcon.png",
title: "Vaskselv 3",
status: "Ud af drift",
},];


export const StovsugerDetails: Stovsuger[] = [
{
id: 1,
image:"/icons/vacuum.png", 
title: "Stovsuger 1",
status: "Ledig",
},
{
id: 2,
image:"/icons/vacuum.png", 
title: "Stovsuger 2",
status: "Optaget",
},
{
id: 3,
image:"/icons/vacuum.png", 
title: "Stovsuger 3",
status: "Ledig",
},];