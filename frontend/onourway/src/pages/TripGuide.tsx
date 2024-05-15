import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// A list of fantastic places to stop along with their google place ids between each pair of cities
interface Stop {
  _id: string;
  place_id: string;
  stop_name: string;
  time_spent: string;
  address: string;
  description: string;
}

interface GuideCategory {
  seo_description: string;
  stops: Stop[];
}

interface Guide {
  Eccentric: GuideCategory;
  Nature: GuideCategory;
  Foodie: GuideCategory;
  Culture: GuideCategory;
}

interface Guides {
  [key: string]: Guide;
}

const guides: Guides = {
  "New-York-to-Philadelphia": {
    Eccentric: {
      seo_description:
        "Embark on an extraordinary eccentric road trip from New York to Philadelphia, exploring offbeat wonders and curiosities along the way. Unleash your sense of wonder at House of the Nobleman's avant-garde art, immerse yourself in the surreal sculptures of Grounds For Sculpture, and dare to visit The Mutter Museum's medical oddities. Be enchanted by the mosaic wonderland at Magic Gardens and indulge in the whimsical ambiance at One Eyed Betty's eatery. Get ready for a mind-bending journey through the eccentric and peculiar heart of the East Coast!",
      stops: [
        {
          _id: "64b82b00190387d79f9eb277",
          place_id: "ChIJj8FEme5YwYkRloFC1sxpQJc",
          stop_name: "Grounds For Sculpture",
          time_spent: "3 hours",
          address: "80 Sculptors Way, Hamilton Township, NJ 08619",
          description:
            "A surreal wonderland awaits at Grounds For Sculpture. This 42-acre sculpture park combines art and nature, showcasing bizarre and captivating sculptures that will transport you to another realm.",
        },
        {
          _id: "64b82b99190387d79f9eb2ab",
          place_id: "ChIJKZI5O8MyHogRMAkx1ntablc",
          stop_name: "The Mutter Museum",
          time_spent: "2 hours",
          address: "19 S 22nd St, Philadelphia, PA 19103",
          description:
            "The Mutter Museum is not for the faint of heart. This peculiar museum exhibits medical oddities, anatomical specimens, and curiosities that will both amaze and haunt you. A true haven for the eccentric at heart.",
        },
        {
          _id: "64b82bd1190387d79f9eb2df",
          place_id: "ChIJ7x4bRCHGxokR-BVjmbZ2LWk",
          stop_name: "Magic Gardens",
          time_spent: "1.5 hours",
          address: "1020 South St, Philadelphia, PA 19147",
          description:
            "The Magic Gardens is a mesmerizing mosaic art environment that will leave you spellbound. Created by the eccentric artist Isaiah Zagar, this unique space is filled with intricate tiles, mirrors, and sculptures.",
        },
      ],
    },
    Nature: {
      seo_description:
        "Embark on a nature lover's dream road trip from New York to Philadelphia, surrounded by breathtaking landscapes and serene destinations. Experience the wilderness at its best with visits to Storm King Art Center, serene hiking at Wissahickon Valley Park, and the awe-inspiring Longwood Gardens. Unwind in the lap of nature at Bowman's Hill Wildflower Preserve and end your journey with the picturesque beauty of Bartram's Garden. Reconnect with the great outdoors on this rejuvenating and scenic adventure!",
      stops: [
        {
          _id: "64b82c8b190387d79f9eb329",
          place_id: "ChIJ1-kIX87SwokRzr_EFr3Htkc",
          stop_name: "Storm King Art Center",
          time_spent: "3 hours",
          address: "1 Museum Rd, New Windsor, NY 12553",
          description:
            "Surrounded by the picturesque Hudson Valley, Storm King Art Center is a vast open-air museum boasting large-scale sculptures and stunning natural landscapes. Embrace art and nature harmoniously blended in this tranquil haven.",
        },
        {
          _id: "64b82ccc190387d79f9eb34f",
          place_id: "ChIJIcPcqf64xokRSPxypSWNWic",
          stop_name: "Wissahickon Valley Park",
          time_spent: "4 hours",
          address: "300 W Northwestern Ave, Philadelphia, PA 19118",
          description:
            "Step into the embrace of nature at Wissahickon Valley Park, where miles of scenic hiking trails lead you through lush woodlands and along the tranquil Wissahickon Creek. Lose yourself in the beauty of this urban oasis.",
        },
        {
          _id: "64b82d08190387d79f9eb375",
          place_id: "ChIJ2VBVVSVWxokR0GCj7N5QgPI",
          stop_name: "Longwood Gardens",
          time_spent: "4 hours",
          address: "1001 Longwood Rd, Kennett Square, PA 19348",
          description:
            "A horticultural paradise awaits at Longwood Gardens. Explore the mesmerizing display of gardens, fountains, and conservatories, immersing yourself in the sights and scents of nature's finest creations.",
        },
        {
          _id: "64b82d5d190387d79f9eb39b",
          place_id: "ChIJCxdvFwr_w4kR40V25ssg3uc",
          stop_name: "Bowman's Hill Wildflower Preserve",
          time_spent: "2 hours",
          address: "1635 River Rd, New Hope, PA 18938",
          description:
            "Discover the wonders of native wildflowers and plants at Bowman's Hill Wildflower Preserve. Stroll through peaceful trails, witness stunning blooms, and relish the tranquility of this botanical gem.",
        },
        {
          _id: "64b82d9b190387d79f9eb3c1",
          place_id: "ChIJmTX_74TGxokRtJ5tELv_3ms",
          stop_name: "Bartram's Garden",
          time_spent: "2.5 hours",
          address: "5400 Lindbergh Blvd, Philadelphia, PA 19143",
          description:
            "Explore America's oldest botanical garden at Bartram's Garden. Walk amidst historic plant collections, enjoy riverfront views, and savor the serenity of this green oasis.",
        },
      ],
    },
    Foodie: {
      seo_description:
        "Embark on a gastronomic journey from New York to Philadelphia, savoring delectable flavors and culinary wonders at every stop. Treat your taste buds with the best of New York's Bagels, relish famous Amish pies, savor mouthwatering cheesesteaks, and indulge in gourmet chocolate treats. End your foodie adventure with an iconic Philly pretzel, leaving you with delightful memories and a satisfied palate!",
      stops: [
        {
          _id: "64b82ebe190387d79f9eb3f5",
          place_id: "ChIJw1tqJgtZwokRqQLff0JEDQU",
          stop_name: "Ess-a-Bagel",
          time_spent: "1 hour",
          address: "324 1st Ave, New York, NY 10009",
          description:
            "Start your foodie adventure with a classic New York experience – the perfect bagel. Ess-a-Bagel serves hand-rolled, kettle-boiled bagels with a variety of scrumptious spreads that will leave you craving for more.",
        },
        {
          _id: "64b84156f2f7c3835bf6347e",
          place_id: "ChIJhf_5q205xokR0c5bxsvagHY",
          stop_name: "Dutch Haven",
          time_spent: "1.5 hours",
          address: "2857A Lincoln Hwy E, Ronks, PA 17572",
          description:
            "At Dutch Haven, indulge in the famous Amish Shoo-fly pie and other delightful Pennsylvania Dutch treats. This charming stop offers sweet and savory flavors that exemplify the region's traditional cuisine.",
        },
        {
          _id: "64b84178f2f7c3835bf634a7",
          place_id: "ChIJCQH7WCnGxokRAWsd3AfQj80",
          stop_name: "Reading Terminal Market",
          time_spent: "2.5 hours",
          address: "51 N 12th St, Philadelphia, PA 19107",
          description:
            "A foodie's paradise awaits at Reading Terminal Market. Sample a wide array of local and international dishes, from soul food to fresh seafood. Don't miss the chance to savor the famous Philly Cheesesteaks!",
        },
        {
          _id: "64b84195f2f7c3835bf634a9",
          place_id: "ChIJbzwXfY_IxokRfFuaybuN-Hc",
          stop_name: "Shane Confectionery",
          time_spent: "1 hour",
          address: "110 Market St, Philadelphia, PA 19106",
          description:
            "Indulge your sweet tooth at Shane Confectionery, one of America's oldest candy shops. Treat yourself to artisanal chocolates, handcrafted candies, and delightful confections that will leave you in a state of bliss.",
        },
        {
          _id: "64b841c0f2f7c3835bf634dd",
          place_id: "ChIJMR_egO8Gx4kR0Ho2HAz1qMc",
          stop_name: "Philly Pretzel Factory",
          time_spent: "1 hour",
          address: "2114 S Christopher Columbus Blvd, Philadelphia, PA 19148",
          description:
            "End your foodie adventure with an iconic Philly pretzel. The Philly Pretzel Factory offers freshly baked, soft pretzels with various dips and toppings – a perfect way to wrap up your delicious journey.",
        },
      ],
    },
    Culture: {
      seo_description:
        "Step into the past with a captivating historic road trip from New York to Philadelphia, where storied landmarks and significant sites await. Discover the iconic Ellis Island and the Statue of Liberty, relive the Revolutionary era at Independence Hall, and pay tribute to the Liberty Bell. Unearth the secrets of the Eastern State Penitentiary, and end your historic journey with a visit to the renowned Betsy Ross House, where the first American flag was sewn.",
      stops: [
        {
          _id: "64b8423bf2f7c3835bf63511",
          place_id: "ChIJDw5fGZpQwokR69Yikp1Go9I",
          stop_name: "Ellis Island",
          time_spent: "3 hours",
          address: "Ellis Island, New York, NY 10004",
          description:
            "Begin your historic adventure with a visit to Ellis Island, the gateway for millions of immigrants entering the United States. Explore the Immigration Museum and trace the footsteps of those who shaped American history.",
        },
        {
          _id: "64b84272f2f7c3835bf63515",
          place_id: "ChIJd8kca4PIxokRqW59OWceihQ",
          stop_name: "Independence Hall",
          time_spent: "2.5 hours",
          address: "520 Chestnut St, Philadelphia, PA 19106",
          description:
            "Step into the heart of American history at Independence Hall, where the Declaration of Independence and the U.S. Constitution were debated and adopted. Guided tours will immerse you in the spirit of the American Revolution.",
        },
        {
          _id: "64b84257f2f7c3835bf63513",
          place_id: "ChIJo9mN1XTJxokRXw7NyvRIrB8",
          stop_name: "Liberty Bell Center",
          time_spent: "1.5 hours",
          address: "526 Market St, Philadelphia, PA 19106",
          description:
            "Discover the enduring symbol of American independence at the Liberty Bell Center. This historic bell rang in the announcement of the Declaration of Independence and remains a cherished national icon.",
        },
        {
          _id: "64b84293f2f7c3835bf6353b",
          place_id: "ChIJu35ZOcnHxokRrTUi4cDYHm8",
          stop_name: "Eastern State Penitentiary",
          time_spent: "2 hours",
          address: "2027 Fairmount Ave, Philadelphia, PA 19130",
          description:
            "Delve into the haunting history of the Eastern State Penitentiary, once a groundbreaking prison and now an eerie yet fascinating museum. Learn about the lives of notorious inmates and the evolution of the prison system.",
        },
      ],
    },
  },
  "New-York-to-Boston": {
    Eccentric: {
      seo_description:
        "Embark on a wild and eccentric road trip from New York to Boston, unveiling bizarre wonders and eccentricities at every stop. Be amazed by the Museum of Interesting Things, explore the wacky world of the Trash Museum, and marvel at the eccentric art of Mass MoCA. Dare to visit the eerie Salem Witch Museum and conclude your eccentric expedition at the enchanting Shell Grotto. Get ready for an eccentric journey like no other!",
      stops: [
        {
          _id: "64b8436ff2f7c3835bf6353d",
          place_id: "ChIJx30R4-5YwokRuFC0O5aPB2M",
          stop_name: "Massachusetts Museum of Contemporary Art (Mass MoCA)",
          time_spent: "3 hours",
          address: "1040 Mass MoCA Way, North Adams, MA 01247",
          description:
            "Explore the eccentric art world at Mass MoCA, where contemporary art installations challenge the norm and provoke your imagination. This sprawling museum showcases avant-garde creations that will leave you inspired.",
        },
        {
          _id: "64b843b8f2f7c3835bf6353f",
          place_id: "ChIJ9_27aW8U44kRA2HY1Vk_xxQ",
          stop_name: "Salem Witch Museum",
          time_spent: "2 hours",
          address: "19 1/2 Washington Square N, Salem, MA 01970",
          description:
            "Unravel the mysteries of the Salem witch trials at the Salem Witch Museum. Delve into the bizarre history and folklore surrounding this infamous event, making for an eerie and unconventional stop.",
        },
      ],
    },
    Nature: {
      seo_description:
        "Embark on a rejuvenating nature escape from New York to Boston, surrounded by breathtaking landscapes and tranquil retreats. Wander through the idyllic Storm King Art Center, hike amidst the stunning scenery of the Catskill Mountains, and revel in the natural beauty of Acadia National Park. Discover the enchanting beauty of Mystic Seaport and conclude your nature-filled journey at the picturesque Boston Public Garden.",
      stops: [
        {
          _id: "64b82c8b190387d79f9eb329",
          place_id: "ChIJ1-kIX87SwokRzr_EFr3Htkc",
          stop_name: "Storm King Art Center",
          time_spent: "3 hours",
          address: "1 Museum Rd, New Windsor, NY 12553",
          description:
            "Start your nature escape with a visit to Storm King Art Center, an outdoor sculpture park boasting awe-inspiring artworks set amidst a backdrop of rolling hills and woodlands. Marvel at the seamless fusion of art and nature.",
        },
        {
          _id: "64b843fbf2f7c3835bf63541",
          place_id: "ChIJMS_4aFZm3IkR-o47QnYjATs",
          stop_name: "Catskill Mountains",
          time_spent: "2 days",
          address: "Catskill Mountains, NY",
          description:
            "Venture into the Catskill Mountains and indulge in a nature-filled retreat. Hike scenic trails, enjoy the beauty of cascading waterfalls, and relish the serenity of these majestic mountains during a blissful two-day stopover.",
        },
        {
          _id: "64b84434f2f7c3835bf63543",
          place_id: "ChIJV8xqXRAK5okRfGbbHiMrR9U",
          stop_name: "Mystic Seaport",
          time_spent: "2 hours",
          address: "75 Greenmanville Ave, Mystic, CT 06355",
          description:
            "Step back in time at Mystic Seaport, an outdoor maritime museum that recreates a 19th-century coastal village. Wander through historic ships, experience traditional crafts, and enjoy the maritime charm of this scenic stop.",
        },
        {
          _id: "64b84452f2f7c3835bf63545",
          place_id: "ChIJu2Argp5w44kRAecWXgt_18s",
          stop_name: "Boston Public Garden",
          time_spent: "2 hours",
          address: "69 Beacon St, Boston, MA 02108",
          description:
            "Conclude your nature-filled journey at Boston Public Garden, a serene oasis in the heart of the city. Stroll through lush gardens, admire the swan boats, and relax in the tranquility of this beautiful urban park.",
        },
      ],
    },
    Foodie: {
      seo_description:
        "Embark on a delectable foodie expedition from New York to Boston, savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in authentic New York-style pizza, relish delicious seafood at Mystic, and feast on iconic New England clam chowder. Experience a gourmet dining delight in Providence and conclude your foodie adventure with Boston's famous lobster rolls.",
      stops: [
        {
          _id: "64b8448ff2f7c3835bf63547",
          place_id: "ChIJAQr5tjBawokRBBESUv8Tw5I",
          stop_name: "Juliana's Pizza",
          time_spent: "1 hour",
          address: "19 Old Fulton St, Brooklyn, NY 11201",
          description:
            "Begin your foodie expedition with a slice of heaven at Juliana's Pizza, where handcrafted, coal-fired, New York-style pizzas are topped with the finest ingredients, making every bite a delightful experience.",
        },
        {
          _id: "64b84541f2f7c3835bf63549",
          place_id: "ChIJb7-6v8136IkRuqM19TMxof0",
          stop_name: "Stowe's Seafood",
          time_spent: "1 hour",
          address: "347 Beach St, West Haven, CT 06516, USA",
          description:
            "No foodie expedition to Boston is complete without a steaming bowl of New England clam chowder. Savor this iconic creamy and flavorful dish at various locations in the city.",
        },
        {
          _id: "64b84ad8f2f7c3835bf63613",
          place_id: "ChIJ95EjMYB644kRHrS_JLt0-Lg",
          stop_name: "Row 34",
          time_spent: "1.5 hours",
          address: "383 Congress St, Boston, MA 02210",
          description:
            "Conclude your foodie adventure with Boston's signature dish – the lobster roll. Sink your teeth into succulent lobster meat nestled in a buttery roll.",
        },
      ],
    },
    Culture: {
      seo_description:
        "Embark on a captivating cultural exploration from New York to Boston, discovering artistic gems, historical landmarks, and diverse traditions at every stop. Immerse yourself in the captivating art scene at The Met, explore the profound legacy of Mark Twain House, and savor the maritime charm of Mystic Seaport. Relive America's revolutionary history at Freedom Trail and conclude your cultural journey with an enriching visit to the Isabella Stewart Gardner Museum.",
      stops: [
        {
          _id: "64b848aaf2f7c3835bf635e5",
          place_id: "ChIJFQDsU9Uz3YkR_pQqgPsR8I4",
          stop_name: "Dia Beacon",
          time_spent: "3 hours",
          address: "3 Beekman St, Beacon, NY 12508",
          description:
            "Begin your cultural exploration at Dia:Beacon, a contemporary art museum situated along the Hudson River. Delve into thought-provoking exhibits and immerse yourself in a unique art experience.",
        },
        {
          _id: "64b845dbf2f7c3835bf63571",
          place_id: "ChIJSSLszVFT5okRz87o7hdkuAU",
          stop_name: "Mark Twain House & Museum",
          time_spent: "2 hours",
          address: "351 Farmington Ave, Hartford, CT 06105",
          description:
            "Discover the profound legacy of Mark Twain at his former residence. Explore the author's life and works, gaining insights into American literature and the creative spirit of one of its iconic figures.",
        },
        {
          _id: "64b84592f2f7c3835bf6356f",
          place_id: "ChIJKY6zkCRF5IkRyyCi9_xpfgs",
          stop_name: "Brown University",
          time_spent: "2 hours",
          address: "",
          description:
            "Continue your cultural exploration with a visit to Brown University, a leading academic institution and historic landmark in Rhode Island.",
        },
        {
          _id: "64b8460bf2f7c3835bf63573",
          place_id:
            "Eh5GcmVlZG9tIFRyYWlsLCBCb3N0b24sIE1BLCBVU0EiLiosChQKEgnJRGOanHDjiRF60rq35l",
          stop_name: "Freedom Trail",
          time_spent: "1 day",
          address: "Freedom Trail, Boston, MA",
          description:
            "Relive America's revolutionary history along the iconic Freedom Trail in Boston. Wander through historic sites, museums, and landmarks that played a significant role in shaping the nation's identity.",
        },
        {
          _id: "64b8462bf2f7c3835bf63575",
          place_id: "ChIJSYXWkop544kRvTojD82gxdo",
          stop_name: "Isabella Stewart Gardner Museum",
          time_spent: "2 hours",
          address: "25 Evans Way, Boston, MA 02115",
          description:
            "Conclude your cultural journey with a visit to the Isabella Stewart Gardner Museum, a remarkable collection of art and culture housed in a unique Venetian-style palace. Experience the passion and vision of a true cultural connoisseur.",
        },
      ],
    },
  },
  "New-York-to-Washington-DC": {
    Eccentric: {
      seo_description:
        "Embark on a wild and eccentric road trip from New York to Washington, D.C., discovering quirky gems and bizarre wonders directly on your route. Experience the mind-bending art of MoMA PS1, marvel at the oddities of Ripley's Believe It or Not!, and embrace the strange at the National Museum of Health and Medicine. Unleash your inner child at the International Spy Museum and conclude your eccentric expedition with a visit to the surreal House of the Temple.",
      stops: [
        {
          _id: "64b846d2f2f7c3835bf63579",
          place_id: "ChIJwfbFiiNZwokRN8hnF940DbY",
          stop_name: "MoMA PS1",
          time_spent: "2.5 hours",
          address: "22-25 Jackson Ave, Long Island City, NY 11101",
          description:
            "Kickstart your eccentric expedition at MoMA PS1, an avant-garde contemporary art museum housed in a former public school. Immerse yourself in thought-provoking installations and mind-bending exhibits that challenge the norms of art.",
        },
        {
          _id: "64b846bbf2f7c3835bf63577",
          place_id: "ChIJx22iKVlRwYkRU1VYI4MFaLI",
          stop_name: "Sesame Place",
          time_spent: "2 hours",
          address: "",
          description: "Unleash your inner child at Sesame Place in Trenton",
        },
        {
          _id: "64b846eef2f7c3835bf6357b",
          place_id: "ChIJIcEMLjK4t4kROVZhWCIMmr0",
          stop_name: "National Museum of Health and Medicine",
          time_spent: "2 hours",
          address: "2500 Linden Ln, Silver Spring, MD 20910",
          description:
            "Embrace the strange and intriguing at the National Museum of Health and Medicine. This eccentric museum exhibits medical oddities and curiosities that will both amaze and haunt you.",
        },
        {
          _id: "64b8470af2f7c3835bf6357d",
          place_id: "ChIJ7Y9_SpC3t4kRNidcpxFnLy0",
          stop_name: "International Spy Museum",
          time_spent: "2 hours",
          address: "700 L'Enfant Plaza SW, Washington, D.C. 20024",
          description:
            "Unleash your inner spy at the International Spy Museum, a one-of-a-kind attraction exploring the world of espionage and intelligence operations. Immerse yourself in the mysterious world of secret agents and undercover missions.",
        },
        {
          _id: "64b84721f2f7c3835bf6357f",
          place_id: "ChIJl5TcVsK3t4kRbUxAHKI1hzI",
          stop_name: "House of the Temple",
          time_spent: "1.5 hours",
          address: "1733 16th St NW, Washington, D.C. 20009",
          description:
            "Conclude your eccentric expedition with a visit to the House of the Temple, a surreal and monumental building that serves as the headquarters of the Scottish Rite of Freemasonry. Be enchanted by its unique architecture and enigmatic symbolism.",
        },
      ],
    },
    Nature: {
      seo_description:
        "Embark on a rejuvenating nature retreat from New York to Washington, D.C., surrounded by picturesque landscapes and serene outdoor havens. Wander through the enchanting beauty of Shenandoah National Park, hike amidst the stunning scenery of Cunningham Falls State Park, and enjoy the tranquil waters of Catoctin Mountain Park. Experience the natural wonders of Great Falls Park and conclude your nature-filled journey at the captivating United States National Arboretum.",
      stops: [
        {
          _id: "64b84740f2f7c3835bf635a5",
          place_id: "ChIJESb8ihdhtIkRMYiMZWR5F-Y",
          stop_name: "Shenandoah National Park",
          time_spent: "1 day",
          address: "3655 U.S. Highway 211 East, Luray, VA 22835",
          description:
            "Begin your nature retreat at Shenandoah National Park, a pristine wilderness offering scenic drives, hiking trails, and breathtaking vistas of the Blue Ridge Mountains. Immerse yourself in the natural beauty of this protected haven.",
        },
        {
          _id: "64b84759f2f7c3835bf635a7",
          place_id: "ChIJLdVjLDzHyYkROmg0Ol6ZgNc",
          stop_name: "Cunningham Falls State Park",
          time_spent: "2 hours",
          address: "14039 Catoctin Hollow Rd, Thurmont, MD 21788",
          description:
            "Hike amidst the stunning landscapes of Cunningham Falls State Park, featuring cascading waterfalls, picturesque trails, and peaceful forests. Unwind in the tranquility of this scenic park during a two-hour stopover.",
        },
        {
          _id: "64b8477bf2f7c3835bf635a9",
          place_id: "ChIJ0dOB08i4yYkR4Lbb2WIhT5Y",
          stop_name: "Catoctin Mountain Park",
          time_spent: "2 hours",
          address: "14707 Park Central Rd, Thurmont, MD 21788",
          description:
            "Enjoy the tranquil waters and scenic beauty of Catoctin Mountain Park, a haven for nature lovers. Relax by the streams or take a leisurely walk through the verdant landscapes during a two-hour exploration.",
        },
        {
          _id: "64b84794f2f7c3835bf635ab",
          place_id: "ChIJmyW5tMj9wokR-tt4fTtU6GQ",
          stop_name: "Great Falls Park",
          time_spent: "2.5 hours",
          address: "9200 Old Dominion Dr, McLean, VA 22102",
          description:
            "Experience the natural wonders of Great Falls Park, where the Potomac River rushes through picturesque canyons and cascades over breathtaking waterfalls. Explore scenic trails and marvel at the powerful beauty of the falls during a two-and-a-half-hour stopover.",
        },
        {
          _id: "64b847ccf2f7c3835bf635df",
          place_id: "ChIJc81J0H-4t4kRi9BdLXOOfwk",
          stop_name: "United States National Arboretum",
          time_spent: "3 hours",
          address: "3501 New York Ave NE, Washington, D.C. 20002",
          description:
            "Conclude your nature-filled journey at the United States National Arboretum, a sprawling garden with diverse plant collections and serene landscapes. Stroll through the beauty of this botanical haven during a three-hour exploration.",
        },
      ],
    },
    Foodie: {
      seo_description:
        "Embark on a delectable foodie adventure from New York to Washington, D.C., savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in authentic New York-style bagels, feast on mouthwatering crab cakes, and savor the famous cheesesteaks of Philadelphia. Enjoy the flavors of Maryland's seafood and conclude your foodie expedition with D.C.'s iconic half-smoke.",
      stops: [
        {
          _id: "64b84815f2f7c3835bf635e1",
          place_id: "ChIJUSZwpwjGxokRpPURfAyTF1g",
          stop_name: "Pat's King of Steaks",
          time_spent: "1 hour",
          address: "1237 E Passyunk Ave, Philadelphia, PA 19147",
          description:
            "Treat yourself to a classic Philly cheesesteak at Pat's King of Steaks, where the iconic sandwich was born. Savor the flavors of thinly sliced beef, melted cheese, and grilled onions in every bite.",
        },
        {
          _id: "64b84831f2f7c3835bf635e3",
          place_id: "ChIJM_l-a-a3t4kRQa_lW1A7W8k",
          stop_name: "Ben's Chili Bowl",
          time_spent: "1.5 hours",
          address: "1213 U St NW, Washington, D.C. 20009",
          description:
            "Conclude your foodie expedition with a visit to Ben's Chili Bowl, a D.C. institution famous for its half-smoke sausages. Delight in the unique flavors and history of this iconic D.C. eatery.",
        },
      ],
    },
    Culture: {
      seo_description:
        "Embark on a captivating cultural exploration from New York to Washington, D.C., discovering artistic gems, historical landmarks, and diverse traditions. Immerse yourself in the captivating art scene at Dia:Beacon, explore the profound legacy of Princeton University, and relive America's founding at Independence National Historical Park. Discover the rich heritage of Baltimore's Inner Harbor and conclude your cultural journey at the Smithsonian Institution in Washington, D.C.",
      stops: [
        {
          _id: "64b848cef2f7c3835bf635e7",
          place_id: "ChIJ6baYzdjmw4kRTwKQ-tZ-ugI",
          stop_name: "Princeton University",
          time_spent: "3 hours",
          address: "Princeton, NJ 08544",
          description:
            "Explore the prestigious Princeton University, known for its rich history and architectural wonders. Take a campus tour and visit the Princeton University Art Museum for a dose of culture and education.",
        },
        {
          _id: "64b848e2f2f7c3835bf635e9",
          place_id: "ChIJGVDvkoTIxokRIQNxPpqAR4Y",
          stop_name: "Independence National Historical Park",
          time_spent: "2.5 hours",
          address: "143 S 3rd St, Philadelphia, PA 19106",
          description:
            "Relive America's founding at Independence National Historical Park in Philadelphia. Visit the Liberty Bell, Independence Hall, and other significant landmarks that played pivotal roles in shaping the nation.",
        },
        {
          _id: "64b848f6f2f7c3835bf635eb",
          place_id: "ChIJuYSYp2MDyIkRLUHH3Ksi2jk",
          stop_name: "Baltimore's Inner Harbor",
          time_spent: "2.5 hours",
          address: "Baltimore, MD",
          description:
            "Discover the rich heritage and maritime history of Baltimore's Inner Harbor. Explore historic ships, museums, and cultural attractions that celebrate the city's vibrant past and diverse traditions.",
        },
        {
          _id: "64b84929f2f7c3835bf635ed",
          place_id: "ChIJZUSMKDu4t4kRWDMSA8_l8-4",
          stop_name: "Smithsonian Institution",
          time_spent: "1 day",
          address: "Washington, D.C.",
          description:
            "Conclude your cultural journey at the Smithsonian Institution in Washington, D.C. Choose from the numerous museums, galleries, and cultural centers that offer insights into art, history, science, and more.",
        },
      ],
    },
  },
  "New-York-to-Atlanta": {
    Eccentric: {
      seo_description:
        "Embark on a wild and eccentric road trip from New York to Atlanta, discovering quirky gems and bizarre wonders at every stop. Experience the captivating magic of the House of Mystery, marvel at the enigmatic Coral Castle, and explore the world of the peculiar at the International UFO Museum. Step into the surreal at the Neon Boneyard, and conclude your eccentric expedition with a visit to the mesmerizing World of Coca-Cola.",
      stops: [
        {
          _id: "64b96014d2d286f296210dad",
          place_id: "ChIJ6QA5TymgVogRwfAmE5zenDE",
          stop_name: "Mint Museum Uptown",
          time_spent: "2 hours",
          address: "500 S Tryon St, Charlotte, NC 28202",
          description:
            "Begin your expedition at the Mint Museum Uptown, a contemporary art museum with a diverse collection of American, European, and African art. Explore the museum's exhibits and discover the beauty of its architecture.",
        },
        {
          _id: "64b957595b4b8d4186c4a298",
          place_id: "ChIJyWIVfyigVogR6c37kTbkXa4",
          stop_name: "NASCAR Hall of Fame",
          time_spent: "2 hours",
          address: "400 E M.L.K. Jr Blvd, Charlotte, NC 28202",
          description:
            "Visit the NASCAR Hall of Fame, a museum dedicated to the history and heritage of NASCAR. Explore the interactive exhibits and learn about the sport's legendary drivers.",
        },
        {
          _id: "64b9603dd2d286f296210daf",
          place_id: "ChIJ8yjI7H4E9YgRyacfAZqyAUQ",
          stop_name: "World of Coca-Cola",
          time_spent: "2.5 hours",
          address: "121 Baker St NW, Atlanta, GA 30313",
          description:
            "Conclude your eccentric expedition with a visit to the World of Coca-Cola, a mesmerizing museum dedicated to the iconic soda brand. Immerse yourself in the history, art, and tasting experience of Coca-Cola products from around the world.",
        },
      ],
    },
    Nature: {
      seo_description:
        "Embark on a rejuvenating nature retreat from New York to Atlanta, surrounded by picturesque landscapes and serene outdoor havens. Wander through the enchanting beauty of Great Smoky Mountains National Park, explore the breathtaking vistas of Shenandoah National Park, and immerse yourself in the natural wonders of Mammoth Cave National Park. Enjoy the scenic beauty of Blue Ridge Parkway and conclude your nature-filled journey at Atlanta's Piedmont Park.",
      stops: [
        {
          _id: "64b96097d2d286f296210db1",
          place_id: "ChIJPTRyEx5SWYgR43xpB4asTqA",
          stop_name: "Great Smoky Mountains National Park",
          time_spent: "2 days",
          address: "107 Park Headquarters Rd, Gatlinburg, TN 37738",
          description:
            "Begin your nature retreat at Great Smoky Mountains National Park, a pristine wilderness offering scenic drives, hiking trails, and breathtaking vistas of the Appalachian Mountains. Immerse yourself in the natural beauty of this protected haven.",
        },
        {
          _id: "64b84740f2f7c3835bf635a5",
          place_id: "ChIJESb8ihdhtIkRMYiMZWR5F-Y",
          stop_name: "Shenandoah National Park",
          time_spent: "1 day",
          address: "3655 U.S. Highway 211 East, Luray, VA 22835",
          description:
            "Explore the stunning scenery of Shenandoah National Park, featuring scenic drives along the Skyline Drive and hiking trails amidst the Blue Ridge Mountains. Enjoy a day surrounded by nature's wonders.",
        },
        {
          _id: "64b960b8d2d286f296210db3",
          place_id: "ChIJV3vJlE0CZogRwKOAYKCziB8",
          stop_name: "Mammoth Cave National Park",
          time_spent: "1 day",
          address: "1 Mammoth Cave Pkwy, Mammoth Cave, KY 42259",
          description:
            "Discover the natural wonders of Mammoth Cave National Park, home to the world's longest cave system. Take a guided tour through awe-inspiring underground chambers and learn about the park's unique geology.",
        },
        {
          _id: "64b960f8d2d286f296210db5",
          place_id:
            "EiFCbHVlIFJkZyBQa3d5LCBBc2hldmlsbGUsIE5DLCBVU0EiLiosChQKEgkVprrBuJtNiBHN0qoc9t5ajhIUChIJCW8PPKmMWYgRXTo0BsEx75Q",
          stop_name: "Blue Ridge Parkway",
          time_spent: "1 day",
          address: "Blue Ridge Parkway, Asheville, NC",
          description:
            "Enjoy the scenic beauty of Blue Ridge Parkway, a picturesque drive that winds through the Appalachian Highlands. Marvel at the panoramic views and explore charming overlooks and hiking trails.",
        },
        {
          _id: "64b96121d2d286f296210db7",
          place_id: "ChIJGaxkUDkE9YgRDjUv9U7qrvM",
          stop_name: "Piedmont Park",
          time_spent: "2 hours",
          address: "1320 Monroe Dr NE, Atlanta, GA 30306",
          description:
            "Conclude your nature-filled journey at Piedmont Park in Atlanta, a serene urban park offering green spaces, walking trails, and beautiful views of the city skyline. Relax and unwind amidst nature in the heart of Atlanta.",
        },
      ],
    },
    Foodie: {
      seo_description:
        "Embark on a delectable foodie adventure from New York to Atlanta, savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in New York's iconic pizza, feast on mouthwatering barbecue in North Carolina, and savor the rich flavors of Lowcountry cuisine in Savannah. Enjoy the taste of Georgia peaches and conclude your foodie expedition with Atlanta's classic soul food.",
      stops: [
        {
          _id: "64b96169d2d286f296210db9",
          place_id: "ChIJ8Q2WSpJZwokRQz-bYYgEskM",
          stop_name: "Joe's Pizza",
          time_spent: "1 hour",
          address: "7 Carmine St, New York, NY 10014",
          description:
            "Kickstart your foodie adventure with a slice of iconic New York-style pizza at Joe's Pizza. Savor the perfect balance of thin crust, flavorful sauce, and gooey cheese.",
        },
        {
          _id: "64b96252d2d286f296210dbb",
          place_id: "ChIJOTZYHl6XU4gRHDJh188ie1w",
          stop_name: "Lexington Barbecue",
          time_spent: "2 hours",
          address: "100 Smokehouse Ln, Lexington, NC 27295",
          description:
            "Feast on mouthwatering barbecue at Lexington Barbecue in North Carolina, known for its deliciously smoky pork shoulder and traditional Southern sides.",
        },
        {
          _id: "64b9628ed2d286f296210dbd",
          place_id: "ChIJgUolJWwE9YgRnxg5IduXOsg",
          stop_name: "Mary Mac's Tea Room",
          time_spent: "1.5 hours",
          address: "224 Ponce de Leon Ave NE, Atlanta, GA 30308",
          description:
            "Conclude your foodie expedition with a visit to Mary Mac's Tea Room, a classic Atlanta eatery serving up traditional Southern soul food dishes with a warm and welcoming atmosphere.",
        },
      ],
    },
    Culture: {
      seo_description:
        "Embark on a captivating cultural exploration from New York to Atlanta, discovering historic landmarks, artistic gems, and diverse traditions. Immerse yourself in the artistic wonders of The Met, explore the profound legacy of Washington D.C.'s monuments, and visit the captivating National Civil Rights Museum. Discover the rich heritage of Charleston's Historic District and conclude your cultural journey at the Center for Civil and Human Rights in Atlanta.",
      stops: [
        {
          _id: "64b962dbd2d286f296210dbf",
          place_id: "ChIJPRzoQ4AE9YgRqgunUXVptj4",
          stop_name: "Center for Civil and Human Rights",
          time_spent: "2.5 hours",
          address: "100 Ivan Allen Jr Blvd NW, Atlanta, GA 30313",
          description:
            "Conclude your cultural journey at the Center for Civil and Human Rights in Atlanta. Engage with powerful exhibits that explore the global struggle for civil and human rights, leaving you inspired and informed.",
        },
      ],
    },
  },
  //   "Miami-to-Orlando": {
  //     Eccentric: {
  //       seo_description:
  //         "Embark on a wild and eccentric road trip from Miami to Orlando, discovering quirky gems and bizarre wonders at every stop. Experience the oddities at Coral Castle, marvel at the intriguing artifacts of Ripley's Believe It or Not! Museum, and explore the enigmatic Spook Hill. Get your dose of kitsch at the World's Largest McDonald's PlayPlace, and conclude your eccentric expedition with a visit to the Dali Museum.",
  //       stops: [
  //         {
  //           stop_name: "Coral Castle",
  //           time_spent: "2 hours",
  //           address: "28655 S Dixie Hwy, Homestead, FL 33033",
  //           description:
  //             "Begin your eccentric adventure at Coral Castle, a mysterious stone structure built by a single man using peculiar methods. Marvel at the massive coral stones and the enigmatic love story behind this unique attraction.",
  //         },
  //         {
  //           stop_name: "Ripley's Believe It or Not! Museum",
  //           time_spent: "2.5 hours",
  //           address: "8201 International Dr, Orlando, FL 32819",
  //           description:
  //             "Step into the world of the weird and wonderful at Ripley's Believe It or Not! Museum in Orlando. Explore a collection of bizarre artifacts and oddities that will challenge your perceptions of reality.",
  //         },
  //         {
  //           stop_name: "Spook Hill",
  //           time_spent: "1 hour",
  //           address: "Spook Hill, Lake Wales, FL 33853",
  //           description:
  //             "Experience the mysterious Spook Hill, where cars appear to roll uphill against gravity. This optical illusion will leave you scratching your head and questioning the laws of physics.",
  //         },
  //         {
  //           stop_name: "World's Largest McDonald's PlayPlace",
  //           time_spent: "1.5 hours",
  //           address: "6875 Sand Lake Rd, Orlando, FL 32819",
  //           description:
  //             "Get your dose of kitsch and nostalgia at the World's Largest McDonald's PlayPlace in Orlando. Enjoy a meal surrounded by retro décor and let your inner child loose in the expansive play area.",
  //         },
  //         {
  //           stop_name: "The Dali Museum",
  //           time_spent: "3 hours",
  //           address: "1 Dali Blvd, St. Petersburg, FL 33701",
  //           description:
  //             "Conclude your eccentric expedition with a visit to The Dali Museum in St. Petersburg. Immerse yourself in the surreal world of Salvador Dali's art, featuring an extensive collection of his masterpieces.",
  //         },
  //       ],
  //     },
  //     Nature: {
  //       seo_description:
  //         "Embark on a rejuvenating nature retreat from Miami to Orlando, surrounded by picturesque landscapes, wildlife encounters, and serene havens. Explore the beauty of Everglades National Park, wander through the enchanting Fairchild Tropical Botanic Garden, and relax at the stunning Bok Tower Gardens. Experience the wonders of Blue Spring State Park and conclude your nature-filled journey at the Harry P. Leu Gardens in Orlando.",
  //       stops: [
  //         {
  //           stop_name: "Everglades National Park",
  //           time_spent: "2 days",
  //           address: "40001 State Road 9336, Homestead, FL 33034",
  //           description:
  //             "Begin your nature retreat at Everglades National Park, a vast wilderness filled with wetlands, mangroves, and diverse wildlife. Explore hiking trails, take an airboat tour, and immerse yourself in the unique ecosystem.",
  //         },
  //         {
  //           stop_name: "Fairchild Tropical Botanic Garden",
  //           time_spent: "4 hours",
  //           address: "10901 Old Cutler Rd, Coral Gables, FL 33156",
  //           description:
  //             "Wander through the enchanting Fairchild Tropical Botanic Garden, featuring a diverse collection of tropical plants, flowers, and beautiful landscapes. Enjoy a peaceful escape in this botanical oasis.",
  //         },
  //         {
  //           stop_name: "Bok Tower Gardens",
  //           time_spent: "3 hours",
  //           address: "1151 Tower Blvd, Lake Wales, FL 33853",
  //           description:
  //             "Relax at the stunning Bok Tower Gardens, known for its serene atmosphere, lush gardens, and the magnificent singing tower. Enjoy a picnic amidst nature's beauty.",
  //         },
  //         {
  //           stop_name: "Blue Spring State Park",
  //           time_spent: "2 days",
  //           address: "2100 W French Ave, Orange City, FL 32763",
  //           description:
  //             "Experience the wonders of Blue Spring State Park, a sanctuary for manatees during the winter months. Enjoy hiking, kayaking, and the opportunity to spot Florida's gentle giants.",
  //         },
  //         {
  //           stop_name: "Harry P. Leu Gardens",
  //           time_spent: "3 hours",
  //           address: "1920 N Forest Ave, Orlando, FL 32803",
  //           description:
  //             "Conclude your nature-filled journey at Harry P. Leu Gardens in Orlando. Explore beautiful gardens, scenic walkways, and a historic home, all set amidst the natural beauty of Florida.",
  //         },
  //       ],
  //     },
  //     Foodie: {
  //       seo_description:
  //         "Embark on a delectable foodie adventure from Miami to Orlando, savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in Miami's iconic Cuban cuisine, feast on fresh seafood in Fort Pierce, and savor authentic Florida barbecue. Enjoy a sweet stop at the Peterbrooke Chocolatier and conclude your foodie expedition with a visit to Orlando's East End Market.",
  //       stops: [
  //         {
  //           stop_name: "Versailles Restaurant",
  //           time_spent: "2 hours",
  //           address: "3555 SW 8th St, Miami, FL 33135",
  //           description:
  //             "Begin your foodie adventure with a taste of Miami's iconic Cuban cuisine at Versailles Restaurant. Savor classic dishes like Cuban sandwiches, picadillo, and delicious pastries.",
  //         },
  //         {
  //           stop_name: "Original Tiki Bar & Restaurant",
  //           time_spent: "2.5 hours",
  //           address: "2 Avenue A, Fort Pierce, FL 34950",
  //           description:
  //             "Feast on fresh seafood and waterfront views at the Original Tiki Bar & Restaurant in Fort Pierce. Enjoy shrimp, oysters, and the catch of the day in a laid-back atmosphere.",
  //         },
  //         {
  //           stop_name: "4 Rivers Smokehouse",
  //           time_spent: "2 hours",
  //           address: "1869 W State Rd 434, Longwood, FL 32750",
  //           description:
  //             "Savor authentic Florida barbecue at 4 Rivers Smokehouse. Indulge in tender smoked meats, savory sides, and delectable desserts for a true Southern food experience.",
  //         },
  //         {
  //           stop_name: "Peterbrooke Chocolatier",
  //           time_spent: "1 hour",
  //           address: "300 S Park Ave #130, Winter Park, FL 32789",
  //           description:
  //             "Enjoy a sweet stop at Peterbrooke Chocolatier in Winter Park. Indulge in handcrafted chocolates, truffles, and other delightful confections.",
  //         },
  //         {
  //           stop_name: "East End Market",
  //           time_spent: "2 hours",
  //           address: "3201 Corrine Dr, Orlando, FL 32803",
  //           description:
  //             "Conclude your foodie expedition at East End Market in Orlando, a culinary hub featuring artisanal products and local eateries. Sample gourmet treats and unique flavors.",
  //         },
  //       ],
  //     },
  //     Culture: {
  //       seo_description:
  //         "Embark on a captivating cultural exploration from Miami to Orlando, discovering art, history, and diverse traditions. Immerse yourself in the artistic wonders of Wynwood Walls, explore the rich Cuban heritage at Little Havana, and visit the enchanting Morikami Museum and Japanese Gardens. Experience the beauty of Vizcaya Museum and Gardens and conclude your cultural journey at the Charles Hosmer Morse Museum of American Art.",
  //       stops: [
  //         {
  //           stop_name: "Wynwood Walls",
  //           time_spent: "2.5 hours",
  //           address: "2520 NW 2nd Ave, Miami, FL 33127",
  //           description:
  //             "Begin your cultural exploration at Wynwood Walls, a vibrant outdoor art gallery showcasing stunning murals and street art by local and international artists.",
  //         },
  //         {
  //           stop_name: "Little Havana",
  //           time_spent: "3 hours",
  //           address: "SW 8th St, Miami, FL 33135",
  //           description:
  //             "Explore the rich Cuban heritage at Little Havana in Miami. Experience the lively atmosphere, sample authentic Cuban cuisine, and enjoy live music and dance.",
  //         },
  //         {
  //           stop_name: "Morikami Museum and Japanese Gardens",
  //           time_spent: "3 hours",
  //           address: "4000 Morikami Park Rd, Delray Beach, FL 33446",
  //           description:
  //             "Visit the enchanting Morikami Museum and Japanese Gardens, offering insights into Japanese culture and art. Stroll through serene gardens and admire traditional art exhibits.",
  //         },
  //         {
  //           stop_name: "Vizcaya Museum and Gardens",
  //           time_spent: "2.5 hours",
  //           address: "3251 S Miami Ave, Miami, FL 33129",
  //           description:
  //             "Experience the beauty of Vizcaya Museum and Gardens, a stunning villa with European-inspired architecture and lush gardens overlooking Biscayne Bay.",
  //         },
  //         {
  //           stop_name: "Charles Hosmer Morse Museum of American Art",
  //           time_spent: "2 hours",
  //           address: "445 N Park Ave, Winter Park, FL 32789",
  //           description:
  //             "Conclude your cultural journey at the Charles Hosmer Morse Museum of American Art in Winter Park. Discover an extensive collection of works by Louis Comfort Tiffany and other American artists.",
  //         },
  //       ],
  //     },
  //   },
  //   "Miami-to-Tampa": {
  //     Eccentric: {
  //       seo_description:
  //         "Embark on a wild and eccentric road trip from Miami to Tampa, discovering quirky gems and bizarre wonders at every stop. Experience the oddities at Coral Castle, marvel at the curious Weeki Wachee Springs, and explore the enigmatic Solomon's Castle. Visit the artistic and mysterious Salvador Dali Museum, and conclude your eccentric expedition at the quirky International Independent Showmen's Museum.",
  //       stops: [
  //         {
  //           stop_name: "Coral Castle",
  //           time_spent: "2 hours",
  //           address: "28655 S Dixie Hwy, Homestead, FL 33033",
  //           description:
  //             "Begin your eccentric adventure at Coral Castle, a mysterious stone structure built by a single man using peculiar methods. Marvel at the massive coral stones and the enigmatic love story behind this unique attraction.",
  //         },
  //         {
  //           stop_name: "Weeki Wachee Springs",
  //           time_spent: "2.5 hours",
  //           address: "6131 Commercial Way, Weeki Wachee, FL 34606",
  //           description:
  //             "Step into the world of the curious at Weeki Wachee Springs, a quirky attraction featuring live mermaid shows and underwater performances. Embrace the enchanting and whimsical experience.",
  //         },
  //         {
  //           stop_name: "Solomon's Castle",
  //           time_spent: "2.5 hours",
  //           address: "4533 Solomon Rd, Ona, FL 33865",
  //           description:
  //             "Explore the enigmatic Solomon's Castle, a quirky creation made of recycled materials, including newspapers and aluminum. Discover the eccentric art and unusual architecture of this hidden gem.",
  //         },
  //         {
  //           stop_name: "Salvador Dali Museum",
  //           time_spent: "3 hours",
  //           address: "1 Dali Blvd, St. Petersburg, FL 33701",
  //           description:
  //             "Experience the artistic and mysterious at the Salvador Dali Museum in St. Petersburg. Immerse yourself in the surreal world of Salvador Dali's art, featuring an extensive collection of his masterpieces.",
  //         },
  //         {
  //           stop_name: "International Independent Showmen's Museum",
  //           time_spent: "2 hours",
  //           address: "6938 Riverview Dr, Riverview, FL 33578",
  //           description:
  //             "Conclude your eccentric expedition at the International Independent Showmen's Museum in Tampa. Discover the fascinating world of carnival rides, sideshows, and circus memorabilia.",
  //         },
  //       ],
  //     },
  //     Nature: {
  //       seo_description:
  //         "Embark on a rejuvenating nature retreat from Miami to Tampa, surrounded by picturesque landscapes, wildlife encounters, and serene havens. Explore the beauty of Everglades National Park, wander through the enchanting Corkscrew Swamp Sanctuary, and relax at Fort De Soto Park. Discover the wonders of Myakka River State Park and conclude your nature-filled journey at Lettuce Lake Regional Park.",
  //       stops: [
  //         {
  //           stop_name: "Everglades National Park",
  //           time_spent: "2 days",
  //           address: "40001 State Road 9336, Homestead, FL 33034",
  //           description:
  //             "Begin your nature retreat at Everglades National Park, a vast wilderness filled with wetlands, mangroves, and diverse wildlife. Explore hiking trails, take an airboat tour, and immerse yourself in the unique ecosystem.",
  //         },
  //         {
  //           stop_name: "Corkscrew Swamp Sanctuary",
  //           time_spent: "4 hours",
  //           address: "375 Sanctuary Rd W, Naples, FL 34120",
  //           description:
  //             "Wander through the enchanting Corkscrew Swamp Sanctuary, a haven for birds and wildlife. Stroll along the boardwalk through ancient cypress forests and marshes.",
  //         },
  //         {
  //           stop_name: "Fort De Soto Park",
  //           time_spent: "2 days",
  //           address: "3500 Pinellas Bayway S, Tierra Verde, FL 33715",
  //           description:
  //             "Relax at Fort De Soto Park, a beautiful coastal park with pristine beaches, nature trails, and historic fortifications. Enjoy birdwatching and take in breathtaking sunset views.",
  //         },
  //         {
  //           stop_name: "Myakka River State Park",
  //           time_spent: "2 days",
  //           address: "13208 State Rd 72, Sarasota, FL 34241",
  //           description:
  //             "Experience the wonders of Myakka River State Park, one of Florida's oldest and largest state parks. Enjoy boating, hiking, and wildlife spotting in this scenic wilderness area.",
  //         },
  //         {
  //           stop_name: "Lettuce Lake Regional Park",
  //           time_spent: "3 hours",
  //           address: "6920 E Fletcher Ave, Tampa, FL 33637",
  //           description:
  //             "Conclude your nature-filled journey at Lettuce Lake Regional Park in Tampa. Explore nature trails, boardwalks, and enjoy birdwatching opportunities along the Hillsborough River.",
  //         },
  //       ],
  //     },
  //     Foodie: {
  //       seo_description:
  //         "Embark on a delectable foodie adventure from Miami to Tampa, savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in Miami's iconic Cuban cuisine, feast on fresh seafood in St. Pete Beach, and savor authentic Southern barbecue. Enjoy a sweet stop at the Datz Dough bakery, and conclude your foodie expedition with a taste of Tampa's famous Cuban sandwich.",
  //       stops: [
  //         {
  //           stop_name: "Versailles Restaurant",
  //           time_spent: "2 hours",
  //           address: "3555 SW 8th St, Miami, FL 33135",
  //           description:
  //             "Begin your foodie adventure with a taste of Miami's iconic Cuban cuisine at Versailles Restaurant. Savor classic dishes like Cuban sandwiches, picadillo, and delicious pastries.",
  //         },
  //         {
  //           stop_name: "Sea Critters Cafe",
  //           time_spent: "2.5 hours",
  //           address: "2007 Pass-A-Grille Way, St Pete Beach, FL 33706",
  //           description:
  //             "Feast on fresh seafood and coastal flavors at Sea Critters Cafe in St. Pete Beach. Enjoy shrimp, grouper, and other delectable catches in a beachfront setting.",
  //         },
  //         {
  //           stop_name: "4 Rivers Smokehouse",
  //           time_spent: "2.5 hours",
  //           address: "9220 Bay Plaza Blvd, Tampa, FL 33619",
  //           description:
  //             "Savor authentic Southern barbecue at 4 Rivers Smokehouse. Indulge in tender smoked meats, savory sides, and delectable desserts for a true foodie delight.",
  //         },
  //         {
  //           stop_name: "Datz Dough",
  //           time_spent: "1 hour",
  //           address: "2602 S MacDill Ave, Tampa, FL 33629",
  //           description:
  //             "Enjoy a sweet stop at Datz Dough bakery in Tampa. Indulge in gourmet donuts, pastries, and other delightful confections.",
  //         },
  //         {
  //           stop_name: "Columbia Restaurant",
  //           time_spent: "2 hours",
  //           address: "2117 E 7th Ave, Tampa, FL 33605",
  //           description:
  //             "Conclude your foodie expedition with a taste of Tampa's famous Cuban sandwich at Columbia Restaurant. This iconic eatery serves up traditional Spanish and Cuban cuisine.",
  //         },
  //       ],
  //     },
  //     Culture: {
  //       seo_description:
  //         "Embark on a captivating cultural exploration from Miami to Tampa, discovering art, history, and diverse traditions. Immerse yourself in the artistic wonders of the Pérez Art Museum Miami, explore the rich Cuban heritage at Ybor City, and visit the enchanting Henry B. Plant Museum. Experience the beauty of the Tampa Museum of Art and conclude your cultural journey at the Florida Museum of Photographic Arts.",
  //       stops: [
  //         {
  //           stop_name: "Pérez Art Museum Miami",
  //           time_spent: "3 hours",
  //           address: "1103 Biscayne Blvd, Miami, FL 33132",
  //           description:
  //             "Begin your cultural exploration at the Pérez Art Museum Miami, an iconic museum showcasing contemporary and modern art from around the world.",
  //         },
  //         {
  //           stop_name: "Ybor City",
  //           time_spent: "3 hours",
  //           address: "Ybor City, Tampa, FL 33605",
  //           description:
  //             "Explore the rich Cuban heritage at Ybor City in Tampa. This historic district is known for its vibrant culture, cigar-making history, and diverse community.",
  //         },
  //         {
  //           stop_name: "Henry B. Plant Museum",
  //           time_spent: "2 hours",
  //           address: "401 W Kennedy Blvd, Tampa, FL 33606",
  //           description:
  //             "Visit the enchanting Henry B. Plant Museum, housed in the former Tampa Bay Hotel. Explore the Gilded Age exhibits and learn about Florida's history and culture.",
  //         },
  //         {
  //           stop_name: "Tampa Museum of Art",
  //           time_spent: "2.5 hours",
  //           address: "120 W Gasparilla Plaza, Tampa, FL 33602",
  //           description:
  //             "Experience the beauty of the Tampa Museum of Art, featuring an impressive collection of classical and contemporary art from various cultures.",
  //         },
  //         {
  //           stop_name: "Florida Museum of Photographic Arts",
  //           time_spent: "2 hours",
  //           address: "400 N Ashley Dr, Cube 200, Tampa, FL 33602",
  //           description:
  //             "Conclude your cultural journey at the Florida Museum of Photographic Arts, dedicated to photography as an art form. Explore captivating visual narratives and exhibitions.",
  //         },
  //       ],
  //     },
  //   },
  //   "Miami-to-Jacksonville": {
  //     Eccentric: {
  //       seo_description:
  //         "Embark on a wild and eccentric road trip from Miami to Jacksonville, discovering quirky gems and bizarre wonders at every stop. Experience the oddities at Coral Castle, marvel at the mysterious Skunk Ape Research Headquarters, and explore the enigmatic House of Mystery and Imagination. Visit the whimsical Cassadaga Spiritualist Camp, and conclude your eccentric expedition with a visit to the intriguing Museum of Science & History.",
  //       stops: [
  //         {
  //           stop_name: "Coral Castle",
  //           time_spent: "2 hours",
  //           address: "28655 S Dixie Hwy, Homestead, FL 33033",
  //           description:
  //             "Begin your eccentric adventure at Coral Castle, a mysterious stone structure built by a single man using peculiar methods. Marvel at the massive coral stones and the enigmatic love story behind this unique attraction.",
  //         },
  //         {
  //           stop_name: "Skunk Ape Research Headquarters",
  //           time_spent: "2.5 hours",
  //           address: "40904 Tamiami Trail E, Ochopee, FL 34141",
  //           description:
  //             "Step into the world of the bizarre at the Skunk Ape Research Headquarters, a quirky attraction dedicated to the elusive Florida Skunk Ape. Explore the swamps and hear tales of this cryptid creature.",
  //         },
  //         {
  //           stop_name: "House of Mystery and Imagination",
  //           time_spent: "2.5 hours",
  //           address: "1861 N Econlockhatchee Trail, Orlando, FL 32817",
  //           description:
  //             "Explore the enigmatic House of Mystery and Imagination, an interactive art installation featuring mind-bending illusions and curious exhibits. Challenge your perceptions and immerse yourself in wonder.",
  //         },
  //         {
  //           stop_name: "Cassadaga Spiritualist Camp",
  //           time_spent: "3 hours",
  //           address: "1112 Stevens St, Cassadaga, FL 32706",
  //           description:
  //             "Visit the whimsical Cassadaga Spiritualist Camp, a spiritual community known for its psychics and mediums. Experience a psychic reading or simply enjoy the mystical atmosphere.",
  //         },
  //         {
  //           stop_name: "Museum of Science & History",
  //           time_spent: "2.5 hours",
  //           address: "1025 Museum Cir, Jacksonville, FL 32207",
  //           description:
  //             "Conclude your eccentric expedition at the Museum of Science & History in Jacksonville. Explore interactive exhibits, ancient artifacts, and scientific wonders.",
  //         },
  //       ],
  //     },
  //     Nature: {
  //       seo_description:
  //         "Embark on a rejuvenating nature retreat from Miami to Jacksonville, surrounded by picturesque landscapes, wildlife encounters, and serene havens. Explore the beauty of Everglades National Park, wander through the enchanting Gainesville-Hawthorne State Trail, and relax at Ichetucknee Springs State Park. Discover the wonders of Okefenokee Swamp Park and conclude your nature-filled journey at Big Talbot Island State Park.",
  //       stops: [
  //         {
  //           stop_name: "Everglades National Park",
  //           time_spent: "2 days",
  //           address: "40001 State Road 9336, Homestead, FL 33034",
  //           description:
  //             "Begin your nature retreat at Everglades National Park, a vast wilderness filled with wetlands, mangroves, and diverse wildlife. Explore hiking trails, take an airboat tour, and immerse yourself in the unique ecosystem.",
  //         },
  //         {
  //           stop_name: "Gainesville-Hawthorne State Trail",
  //           time_spent: "3 hours",
  //           address: "3400 SE 15th St, Gainesville, FL 32641",
  //           description:
  //             "Wander through the enchanting Gainesville-Hawthorne State Trail, a 16-mile long trail surrounded by lush landscapes and scenic vistas, perfect for biking or hiking.",
  //         },
  //         {
  //           stop_name: "Ichetucknee Springs State Park",
  //           time_spent: "2 days",
  //           address: "12087 SW US Highway 27, Fort White, FL 32038",
  //           description:
  //             "Relax at Ichetucknee Springs State Park, known for its crystal-clear springs and tubing adventures. Enjoy snorkeling, picnicking, and spotting wildlife along the river.",
  //         },
  //         {
  //           stop_name: "Okefenokee Swamp Park",
  //           time_spent: "2 days",
  //           address: "5700 Okefenokee Swamp Park Rd, Waycross, GA 31503",
  //           description:
  //             "Experience the wonders of Okefenokee Swamp Park, a vast wilderness with wetlands and waterways. Take a guided boat tour and observe the diverse wildlife in their natural habitat.",
  //         },
  //         {
  //           stop_name: "Big Talbot Island State Park",
  //           time_spent: "3 hours",
  //           address: "12157 Heckscher Dr, Jacksonville, FL 32226",
  //           description:
  //             "Conclude your nature-filled journey at Big Talbot Island State Park, known for its unique black rock formations along the shoreline and beautiful coastal landscapes.",
  //         },
  //       ],
  //     },
  //     Foodie: {
  //       seo_description:
  //         "Embark on a delectable foodie adventure from Miami to Jacksonville, savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in Miami's iconic Cuban cuisine, feast on fresh seafood in St. Augustine, and savor authentic Southern barbecue. Enjoy a sweet stop at Sweet Pete's Candy, and conclude your foodie expedition with a taste of Jacksonville's famous shrimp dishes.",
  //       stops: [
  //         {
  //           stop_name: "Versailles Restaurant",
  //           time_spent: "2 hours",
  //           address: "3555 SW 8th St, Miami, FL 33135",
  //           description:
  //             "Begin your foodie adventure with a taste of Miami's iconic Cuban cuisine at Versailles Restaurant. Savor classic dishes like Cuban sandwiches, picadillo, and delicious pastries.",
  //         },
  //         {
  //           stop_name: "Catch 27",
  //           time_spent: "2.5 hours",
  //           address: "40 Charlotte St, St. Augustine, FL 32084",
  //           description:
  //             "Feast on fresh seafood and coastal flavors at Catch 27 in St. Augustine. Enjoy shrimp, oysters, and other delectable catches in a charming setting.",
  //         },
  //         {
  //           stop_name: "The Bearded Pig",
  //           time_spent: "2.5 hours",
  //           address: "1224 Kings Ave, Jacksonville, FL 32207",
  //           description:
  //             "Savor authentic Southern barbecue at The Bearded Pig. Indulge in tender smoked meats, savory sides, and delectable desserts for a true foodie delight.",
  //         },
  //         {
  //           stop_name: "Sweet Pete's Candy",
  //           time_spent: "1 hour",
  //           address: "400 N Hogan St, Jacksonville, FL 32202",
  //           description:
  //             "Enjoy a sweet stop at Sweet Pete's Candy in Jacksonville. Indulge in gourmet chocolates, handcrafted candies, and other delightful confections.",
  //         },
  //         {
  //           stop_name: "Clark's Fish Camp",
  //           time_spent: "2 hours",
  //           address: "12903 Hood Landing Rd, Jacksonville, FL 32258",
  //           description:
  //             "Conclude your foodie expedition with a taste of Jacksonville's famous shrimp dishes at Clark's Fish Camp. This iconic eatery serves up delicious seafood in a unique setting.",
  //         },
  //       ],
  //     },
  //     Culture: {
  //       seo_description:
  //         "Embark on a captivating cultural exploration from Miami to Jacksonville, discovering art, history, and diverse traditions. Immerse yourself in the artistic wonders of the Pérez Art Museum Miami, explore the rich Cuban heritage at Little Havana, and visit the enchanting Cummer Museum of Art & Gardens. Experience the history at the Kingsley Plantation and conclude your cultural journey at the Museum of Science & History.",
  //       stops: [
  //         {
  //           stop_name: "Pérez Art Museum Miami",
  //           time_spent: "3 hours",
  //           address: "1103 Biscayne Blvd, Miami, FL 33132",
  //           description:
  //             "Begin your cultural exploration at the Pérez Art Museum Miami, an iconic museum showcasing contemporary and modern art from around the world.",
  //         },
  //         {
  //           stop_name: "Little Havana",
  //           time_spent: "3 hours",
  //           address: "SW 8th St, Miami, FL 33135",
  //           description:
  //             "Explore the rich Cuban heritage at Little Havana in Miami. Experience the lively atmosphere, sample authentic Cuban cuisine, and enjoy live music and dance.",
  //         },
  //         {
  //           stop_name: "Cummer Museum of Art & Gardens",
  //           time_spent: "2.5 hours",
  //           address: "829 Riverside Ave, Jacksonville, FL 32204",
  //           description:
  //             "Visit the enchanting Cummer Museum of Art & Gardens in Jacksonville. Explore impressive art collections and stroll through beautiful riverfront gardens.",
  //         },
  //         {
  //           stop_name: "Kingsley Plantation",
  //           time_spent: "2 hours",
  //           address: "11676 Palmetto Ave, Jacksonville, FL 32226",
  //           description:
  //             "Experience the history at the Kingsley Plantation, an historic site showcasing the life of early plantation owners in Florida. Learn about the enslaved people who lived and worked here.",
  //         },
  //         {
  //           stop_name: "Museum of Science & History",
  //           time_spent: "2.5 hours",
  //           address: "1025 Museum Cir, Jacksonville, FL 32207",
  //           description:
  //             "Conclude your cultural journey at the Museum of Science & History in Jacksonville. Explore interactive exhibits, ancient artifacts, and scientific wonders.",
  //         },
  //       ],
  //     },
  //   },
  //   "Miami-to-Atlanta": {
  //     Eccentric: {
  //       seo_description:
  //         "Embark on a wild and eccentric road trip from Miami to Atlanta, discovering quirky gems and bizarre wonders at every stop. Experience the oddities at Coral Castle, marvel at the mysterious Skunk Ape Research Headquarters, and explore the enigmatic Doll's Head Trail. Visit the whimsical Junkman's Daughter, and conclude your eccentric expedition at the offbeat Atlanta BeltLine's Krog Street Tunnel.",
  //       stops: [
  //         {
  //           stop_name: "Coral Castle",
  //           time_spent: "2 hours",
  //           address: "28655 S Dixie Hwy, Homestead, FL 33033",
  //           description:
  //             "Begin your eccentric adventure at Coral Castle, a mysterious stone structure built by a single man using peculiar methods. Marvel at the massive coral stones and the enigmatic love story behind this unique attraction.",
  //         },
  //         {
  //           stop_name: "Skunk Ape Research Headquarters",
  //           time_spent: "2.5 hours",
  //           address: "40904 Tamiami Trail E, Ochopee, FL 34141",
  //           description:
  //             "Step into the world of the bizarre at the Skunk Ape Research Headquarters, a quirky attraction dedicated to the elusive Florida Skunk Ape. Explore the swamps and hear tales of this cryptid creature.",
  //         },
  //         {
  //           stop_name: "Doll's Head Trail",
  //           time_spent: "2.5 hours",
  //           address: "2105 Tilly Mill Rd, Atlanta, GA 30360",
  //           description:
  //             "Explore the enigmatic Doll's Head Trail, an art project featuring peculiar sculptures made from discarded dolls and found objects. Stroll through this eccentric outdoor gallery.",
  //         },
  //         {
  //           stop_name: "Junkman's Daughter",
  //           time_spent: "2 hours",
  //           address: "464 Moreland Ave NE, Atlanta, GA 30307",
  //           description:
  //             "Visit the whimsical Junkman's Daughter in Atlanta, a colorful and quirky store filled with offbeat merchandise, vintage clothing, and unique oddities.",
  //         },
  //         {
  //           stop_name: "Krog Street Tunnel",
  //           time_spent: "1.5 hours",
  //           address: "Krog St NE, Atlanta, GA 30307",
  //           description:
  //             "Conclude your eccentric expedition at the Atlanta BeltLine's Krog Street Tunnel, adorned with vibrant street art and graffiti, creating an eccentric and ever-changing urban canvas.",
  //         },
  //       ],
  //     },
  //     Nature: {
  //       seo_description:
  //         "Embark on a rejuvenating nature retreat from Miami to Atlanta, surrounded by picturesque landscapes, national parks, and serene havens. Explore the beauty of Okefenokee Swamp Park, wander through the enchanting Little Talbot Island State Park, and relax at Magnolia Springs State Park. Discover the wonders of Providence Canyon State Park and conclude your nature-filled journey at Chattahoochee River National Recreation Area.",
  //       stops: [
  //         {
  //           stop_name: "Okefenokee Swamp Park",
  //           time_spent: "2 days",
  //           address: "5700 Okefenokee Swamp Park Rd, Waycross, GA 31503",
  //           description:
  //             "Begin your nature retreat at Okefenokee Swamp Park, a vast wilderness with wetlands and waterways. Take a guided boat tour and observe the diverse wildlife in their natural habitat.",
  //         },
  //         {
  //           stop_name: "Little Talbot Island State Park",
  //           time_spent: "2 days",
  //           address: "12157 Heckscher Dr, Jacksonville, FL 32226",
  //           description:
  //             "Wander through the enchanting Little Talbot Island State Park, known for its unspoiled beaches, maritime forests, and diverse ecosystems. Enjoy hiking and birdwatching along the coast.",
  //         },
  //         {
  //           stop_name: "Magnolia Springs State Park",
  //           time_spent: "2 days",
  //           address: "1053 Magnolia Springs Dr, Millen, GA 30442",
  //           description:
  //             "Relax at Magnolia Springs State Park, a peaceful haven with crystal-clear springs and natural beauty. Enjoy picnicking, fishing, and exploring the park's scenic trails.",
  //         },
  //         {
  //           stop_name: "Providence Canyon State Park",
  //           time_spent: "2 days",
  //           address: "8930 Canyon Rd, Lumpkin, GA 31815",
  //           description:
  //             "Experience the wonders of Providence Canyon State Park, also known as Georgia's Little Grand Canyon. Hike the canyons and marvel at the colorful geological formations.",
  //         },
  //         {
  //           stop_name: "Chattahoochee River National Recreation Area",
  //           time_spent: "2 days",
  //           address: "1978 Island Ford Pkwy, Atlanta, GA 30350",
  //           description:
  //             "Conclude your nature-filled journey at Chattahoochee River National Recreation Area in Atlanta. Enjoy scenic river views, hiking trails, and opportunities for outdoor activities.",
  //         },
  //       ],
  //     },
  //     Foodie: {
  //       seo_description:
  //         "Embark on a delectable foodie adventure from Miami to Atlanta, savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in Miami's iconic Cuban cuisine, feast on seafood delights in Savannah, and savor authentic Southern dishes. Enjoy a sweet stop at Sublime Doughnuts, and conclude your foodie expedition with a taste of Atlanta's famous barbecue.",
  //       stops: [
  //         {
  //           stop_name: "Versailles Restaurant",
  //           time_spent: "2 hours",
  //           address: "3555 SW 8th St, Miami, FL 33135",
  //           description:
  //             "Begin your foodie adventure with a taste of Miami's iconic Cuban cuisine at Versailles Restaurant. Savor classic dishes like Cuban sandwiches, picadillo, and delicious pastries.",
  //         },
  //         {
  //           stop_name: "The Grey",
  //           time_spent: "2.5 hours",
  //           address: "109 Martin Luther King Jr Blvd, Savannah, GA 31401",
  //           description:
  //             "Feast on delightful seafood and Southern cuisine at The Grey in Savannah. Enjoy a unique dining experience in a beautifully restored Greyhound bus terminal.",
  //         },
  //         {
  //           stop_name: "Mary Mac's Tea Room",
  //           time_spent: "2.5 hours",
  //           address: "224 Ponce de Leon Ave NE, Atlanta, GA 30308",
  //           description:
  //             "Savor authentic Southern dishes and comfort food at Mary Mac's Tea Room in Atlanta. This historic eatery has been serving delicious homestyle meals for over 75 years.",
  //         },
  //         {
  //           stop_name: "Sublime Doughnuts",
  //           time_spent: "1 hour",
  //           address: "2566 Briarcliff Rd NE, Atlanta, GA 30329",
  //           description:
  //             "Enjoy a sweet stop at Sublime Doughnuts in Atlanta. Indulge in gourmet donuts, pastries, and unique flavor combinations.",
  //         },
  //         {
  //           stop_name: "Fox Bros. Bar-B-Q",
  //           time_spent: "2 hours",
  //           address: "1238 DeKalb Ave NE, Atlanta, GA 30307",
  //           description:
  //             "Conclude your foodie expedition with a taste of Atlanta's famous barbecue at Fox Bros. Bar-B-Q. Savor mouthwatering smoked meats and delicious sides.",
  //         },
  //       ],
  //     },
  //     Culture: {
  //       seo_description:
  //         "Embark on a captivating cultural exploration from Miami to Atlanta, discovering art, history, and diverse traditions. Immerse yourself in the artistic wonders of Pérez Art Museum Miami, explore the rich Cuban heritage at Little Havana, and visit the historic St. Augustine. Experience the diversity of Atlanta's Sweet Auburn Historic District and conclude your cultural journey at the High Museum of Art.",
  //       stops: [
  //         {
  //           stop_name: "Pérez Art Museum Miami",
  //           time_spent: "3 hours",
  //           address: "1103 Biscayne Blvd, Miami, FL 33132",
  //           description:
  //             "Begin your cultural exploration at the Pérez Art Museum Miami, an iconic museum showcasing contemporary and modern art from around the world.",
  //         },
  //         {
  //           stop_name: "Little Havana",
  //           time_spent: "3 hours",
  //           address: "SW 8th St, Miami, FL 33135",
  //           description:
  //             "Explore the rich Cuban heritage at Little Havana in Miami. Experience the lively atmosphere, sample authentic Cuban cuisine, and enjoy live music and dance.",
  //         },
  //         {
  //           stop_name: "St. Augustine",
  //           time_spent: "2 days",
  //           address: "St. Augustine, FL",
  //           description:
  //             "Visit the historic St. Augustine, the oldest city in the United States. Explore Castillo de San Marcos, historic streets, and immerse yourself in the city's cultural legacy.",
  //         },
  //         {
  //           stop_name: "Sweet Auburn Historic District",
  //           time_spent: "2.5 hours",
  //           address: "Auburn Ave NE, Atlanta, GA 30303",
  //           description:
  //             "Experience the diversity of Atlanta's Sweet Auburn Historic District, a cultural hub for African American heritage. Explore the Martin Luther King Jr. National Historic Park and the Apex Museum.",
  //         },
  //         {
  //           stop_name: "High Museum of Art",
  //           time_spent: "3 hours",
  //           address: "1280 Peachtree St NE, Atlanta, GA 30309",
  //           description:
  //             "Conclude your cultural journey at the High Museum of Art in Atlanta. Explore an impressive collection of art from various cultures and time periods.",
  //         },
  //       ],
  //     },
  //   },
  //   "Los-Angeles-to-San-Francisco": {
  //     Eccentric: {
  //       seo_description:
  //         "Embark on an eccentric road trip from Los Angeles to San Francisco, discovering quirky gems and bizarre wonders at every stop. Experience the offbeat vibes of the Museum of Jurassic Technology, marvel at the eccentricity of Salvation Mountain, and explore the mysterious Mystery Spot. Visit the whimsical Bubblegum Alley, and conclude your eccentric expedition at the iconic Winchester Mystery House.",
  //       stops: [
  //         {
  //           stop_name: "Museum of Jurassic Technology",
  //           time_spent: "2 hours",
  //           address: "9341 Venice Blvd, Culver City, CA 90232",
  //           description:
  //             "Begin your eccentric adventure at the Museum of Jurassic Technology, an enigmatic museum that blurs the lines between fact and fiction. Explore the eccentric exhibits and curiosities that will leave you wondering.",
  //         },
  //         {
  //           stop_name: "Salvation Mountain",
  //           time_spent: "2.5 hours",
  //           address: "Beal Rd, Calipatria, CA 92233",
  //           description:
  //             "Step into a colorful world at Salvation Mountain, a vibrant art installation in the California desert. Marvel at the whimsical folk art and messages of love and hope.",
  //         },
  //         {
  //           stop_name: "Mystery Spot",
  //           time_spent: "1.5 hours",
  //           address: "465 Mystery Spot Rd, Santa Cruz, CA 95065",
  //           description:
  //             "Explore the mysterious and gravity-defying Mystery Spot, a place where the laws of physics seem to behave strangely. Experience optical illusions and peculiar phenomena.",
  //         },
  //         {
  //           stop_name: "Bubblegum Alley",
  //           time_spent: "1 hour",
  //           address: "733 Higuera St, San Luis Obispo, CA 93401",
  //           description:
  //             "Visit the whimsical Bubblegum Alley in San Luis Obispo, a quirky alleyway covered in layers of chewed gum. Contribute your own gum art if you dare.",
  //         },
  //         {
  //           stop_name: "Winchester Mystery House",
  //           time_spent: "2 hours",
  //           address: "525 S Winchester Blvd, San Jose, CA 95128",
  //           description:
  //             "Conclude your eccentric expedition at the Winchester Mystery House, an architectural marvel filled with mysterious twists, turns, and staircases to nowhere.",
  //         },
  //       ],
  //     },
  //     Nature: {
  //       seo_description:
  //         "Embark on a rejuvenating nature retreat from Los Angeles to San Francisco, surrounded by picturesque landscapes, national parks, and stunning coastal beauty. Explore the wonders of Malibu Creek State Park, wander through the enchanting Big Sur, and experience the magic of Point Lobos State Natural Reserve. Discover the beauty of Pfeiffer Big Sur State Park and conclude your nature-filled journey at the iconic Golden Gate Park in San Francisco.",
  //       stops: [
  //         {
  //           stop_name: "Malibu Creek State Park",
  //           time_spent: "1 day",
  //           address: "1925 Las Virgenes Rd, Calabasas, CA 91302",
  //           description:
  //             "Begin your nature retreat at Malibu Creek State Park, a serene oasis with hiking trails, scenic canyons, and stunning rock formations. Explore the park's natural beauty and relax in the peaceful surroundings.",
  //         },
  //         {
  //           stop_name: "Big Sur",
  //           time_spent: "2 days",
  //           address: "Big Sur, CA",
  //           description:
  //             "Wander through the enchanting Big Sur, a rugged stretch of California's coastline known for its dramatic cliffs and breathtaking views. Discover hidden coves, redwood forests, and the iconic Bixby Creek Bridge.",
  //         },
  //         {
  //           stop_name: "Point Lobos State Natural Reserve",
  //           time_spent: "1 day",
  //           address: "62 California 1, Carmel-By-The-Sea, CA 93923",
  //           description:
  //             "Experience the magic of Point Lobos State Natural Reserve, a coastal gem with diverse wildlife, secluded coves, and stunning ocean vistas. Take a scenic hike and immerse yourself in the beauty of this protected area.",
  //         },
  //         {
  //           stop_name: "Pfeiffer Big Sur State Park",
  //           time_spent: "1 day",
  //           address: "47225 CA-1, Big Sur, CA 93920",
  //           description:
  //             "Discover the beauty of Pfeiffer Big Sur State Park, home to towering redwoods, picturesque rivers, and hiking trails that lead to scenic viewpoints. Enjoy the tranquility of the forest and the majesty of nature.",
  //         },
  //         {
  //           stop_name: "Golden Gate Park",
  //           time_spent: "1 day",
  //           address: "501 Stanyan St, San Francisco, CA 94117",
  //           description:
  //             "Conclude your nature-filled journey at the iconic Golden Gate Park in San Francisco. Explore the park's gardens, lakes, and green spaces, and unwind in this urban oasis.",
  //         },
  //       ],
  //     },
  //     Foodie: {
  //       seo_description:
  //         "Embark on a delectable foodie adventure from Los Angeles to San Francisco, savoring a culinary journey filled with delightful treats and diverse flavors. Indulge in LA's famous street tacos, feast on seafood delights in Santa Barbara, and savor authentic Italian dishes. Enjoy a sweet stop at Ghirardelli Square, and conclude your foodie expedition with a taste of San Francisco's iconic sourdough bread.",
  //       stops: [
  //         {
  //           stop_name: "Grand Central Market",
  //           time_spent: "2 hours",
  //           address: "317 S Broadway, Los Angeles, CA 90013",
  //           description:
  //             "Begin your foodie adventure at Grand Central Market in Los Angeles, a vibrant food hall offering a wide variety of cuisines. Indulge in LA's famous street tacos, gourmet burgers, and international delights.",
  //         },
  //         {
  //           stop_name: "Santa Barbara Public Market",
  //           time_spent: "2.5 hours",
  //           address: "38 W Victoria St, Santa Barbara, CA 93101",
  //           description:
  //             "Feast on seafood delights and gourmet treats at Santa Barbara Public Market. Sample fresh oysters, artisanal cheeses, and California wines.",
  //         },
  //         {
  //           stop_name: "San Luis Obispo",
  //           time_spent: "2 hours",
  //           address: "San Luis Obispo, CA",
  //           description:
  //             "Explore the charming town of San Luis Obispo and savor authentic Italian dishes at local eateries. Enjoy pasta, wood-fired pizzas, and gelato.",
  //         },
  //         {
  //           stop_name: "Ghirardelli Square",
  //           time_spent: "1.5 hours",
  //           address: "900 North Point St, San Francisco, CA 94109",
  //           description:
  //             "Enjoy a sweet stop at Ghirardelli Square in San Francisco, home to the famous Ghirardelli Chocolate Company. Indulge in gourmet chocolates, decadent sundaes, and other delightful treats.",
  //         },
  //         {
  //           stop_name: "Boudin Bakery",
  //           time_spent: "1.5 hours",
  //           address: "160 Jefferson St, San Francisco, CA 94133",
  //           description:
  //             "Conclude your foodie expedition with a taste of San Francisco's iconic sourdough bread at Boudin Bakery. Witness the art of bread-making and savor the warm, freshly-baked loaves.",
  //         },
  //       ],
  //     },
  //     Culture: {
  //       seo_description:
  //         "Embark on a captivating cultural exploration from Los Angeles to San Francisco, discovering art, history, and diverse traditions. Immerse yourself in the artistic wonders of The Getty Center, explore the rich heritage of Mission Santa Barbara, and experience the diversity of San Francisco's Chinatown. Visit the iconic Alcatraz Island, and conclude your cultural journey at the de Young Museum.",
  //       stops: [
  //         {
  //           stop_name: "The Getty Center",
  //           time_spent: "3 hours",
  //           address: "1200 Getty Center Dr, Los Angeles, CA 90049",
  //           description:
  //             "Begin your cultural exploration at The Getty Center in Los Angeles, an architectural marvel housing impressive art collections from different eras and cultures.",
  //         },
  //         {
  //           stop_name: "Mission Santa Barbara",
  //           time_spent: "2.5 hours",
  //           address: "2201 Laguna St, Santa Barbara, CA 93105",
  //           description:
  //             "Explore the rich cultural heritage of Mission Santa Barbara, known as the Queen of the Missions. Discover the history of Spanish colonization and the Franciscan order in California.",
  //         },
  //         {
  //           stop_name: "Chinatown, San Francisco",
  //           time_spent: "2 hours",
  //           address: "Chinatown, San Francisco, CA",
  //           description:
  //             "Experience the diversity and cultural vibrancy of San Francisco's Chinatown, one of the oldest and largest Chinatowns in the United States. Explore the unique shops, restaurants, and historical landmarks.",
  //         },
  //         {
  //           stop_name: "Alcatraz Island",
  //           time_spent: "3 hours",
  //           address: "Pier 33, San Francisco, CA 94133",
  //           description:
  //             "Visit the iconic Alcatraz Island, once a notorious federal prison. Explore the history of the island and learn about its Native American occupation. Witness stunning views of San Francisco from the island.",
  //         },
  //         {
  //           stop_name: "de Young Museum",
  //           time_spent: "2.5 hours",
  //           address: "50 Hagiwara Tea Garden Dr, San Francisco, CA 94118",
  //           description:
  //             "Conclude your cultural journey at the de Young Museum in San Francisco, featuring an extensive collection of American art, international textiles, and contemporary works.",
  //         },
  //       ],
  //     },
  //   },
  //   "Los-Angeles-to-San-Diego": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "The Museum of Death",
  //           time_spent: "2 hours",
  //           address: "6031 Hollywood Blvd, Los Angeles, CA 90028",
  //           description:
  //             "Begin your eccentric road trip at The Museum of Death in Hollywood. Explore a collection of exhibits and artifacts related to death, including serial killer artwork and crime scene photos.",
  //         },
  //         {
  //           stop_name: "Cabazon Dinosaurs",
  //           time_spent: "1.5 hours",
  //           address: "50770 Seminole Dr, Cabazon, CA 92230",
  //           description:
  //             "Visit the quirky Cabazon Dinosaurs, featuring a massive T-Rex and a brontosaurus. Climb inside the dinosaur structures for a unique photo opportunity.",
  //         },
  //         {
  //           stop_name: "Salvation Mountain",
  //           time_spent: "2.5 hours",
  //           address: "Beal Rd, Calipatria, CA 92233",
  //           description:
  //             "Step into a colorful world at Salvation Mountain, a vibrant art installation in the California desert. Marvel at the whimsical folk art and messages of love and hope.",
  //         },
  //         {
  //           stop_name: "Whaley House Museum",
  //           time_spent: "1.5 hours",
  //           address: "2476 San Diego Ave, San Diego, CA 92110",
  //           description:
  //             "Explore the historic and reportedly haunted Whaley House in San Diego. Discover the rich history and paranormal stories surrounding this fascinating landmark.",
  //         },
  //         {
  //           stop_name: "Unconditional Surrender Statue",
  //           time_spent: "1 hour",
  //           address: "1000 N Harbor Dr, San Diego, CA 92101",
  //           description:
  //             "Conclude your eccentric journey at the Unconditional Surrender Statue, a massive sculpture of a sailor kissing a nurse. Take a quirky photo next to this iconic and controversial statue.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Los Angeles to San Diego, where quirky attractions and offbeat wonders await you. Explore The Museum of Death, visit the quirky Cabazon Dinosaurs, and step into the colorful world of Salvation Mountain. Discover the reportedly haunted Whaley House and conclude your journey at the Unconditional Surrender Statue. Get ready for a peculiar and entertaining journey along the Southern California coast.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "El Matador State Beach",
  //           time_spent: "2 hours",
  //           address: "32350 Pacific Coast Hwy, Malibu, CA 90265",
  //           description:
  //             "Start your nature retreat at El Matador State Beach in Malibu. Discover hidden sea caves, explore tide pools, and witness breathtaking cliffside views of the Pacific Ocean.",
  //         },
  //         {
  //           stop_name: "Santa Monica Mountains National Recreation Area",
  //           time_spent: "3 hours",
  //           address: "401 W Hillcrest Dr, Thousand Oaks, CA 91360",
  //           description:
  //             "Explore the Santa Monica Mountains National Recreation Area, offering a diverse landscape of mountains, canyons, and oak woodlands. Enjoy hiking trails and scenic overlooks.",
  //         },
  //         {
  //           stop_name: "Torrey Pines State Natural Reserve",
  //           time_spent: "2.5 hours",
  //           address: "12600 N Torrey Pines Rd, La Jolla, CA 92037",
  //           description:
  //             "Experience the beauty of Torrey Pines State Natural Reserve, home to rare Torrey Pine trees and stunning coastal vistas. Hike along scenic trails overlooking the Pacific Ocean.",
  //         },
  //         {
  //           stop_name: "Anza-Borrego Desert State Park",
  //           time_spent: "2 days",
  //           address: "200 Palm Canyon Dr, Borrego Springs, CA 92004",
  //           description:
  //             "Discover the vastness of Anza-Borrego Desert State Park, California's largest state park. Witness wildflower blooms, unique geological formations, and stargaze in the dark skies.",
  //         },
  //         {
  //           stop_name: "La Jolla Cove",
  //           time_spent: "2 hours",
  //           address: "1100 Coast Blvd, La Jolla, CA 92037",
  //           description:
  //             "Conclude your nature-filled journey at La Jolla Cove, a picturesque beach known for its marine life and scenic beauty. Enjoy snorkeling, or simply relax and watch the sea lions.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a refreshing nature retreat from Los Angeles to San Diego, surrounded by picturesque landscapes, coastal beauty, and serene parks. Explore El Matador State Beach, hike through Santa Monica Mountains, and experience the beauty of Torrey Pines State Natural Reserve. Discover the vastness of Anza-Borrego Desert State Park and conclude your journey at the scenic La Jolla Cove. Get ready to connect with nature and enjoy the tranquility of Southern California's natural wonders.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Grand Central Market",
  //           time_spent: "2 hours",
  //           address: "317 S Broadway, Los Angeles, CA 90013",
  //           description:
  //             "Begin your foodie adventure at Grand Central Market in Los Angeles, a bustling food hall offering a wide array of cuisines. Indulge in LA's famous street tacos, gourmet burgers, and international delights.",
  //         },
  //         {
  //           stop_name: "In-N-Out Burger",
  //           time_spent: "1 hour",
  //           address: "9149 S Sepulveda Blvd, Los Angeles, CA 90045",
  //           description:
  //             "Savor the iconic flavors of In-N-Out Burger, a beloved West Coast fast-food chain famous for its fresh and delicious burgers, fries, and milkshakes.",
  //         },
  //         {
  //           stop_name: "Taco Stand",
  //           time_spent: "1.5 hours",
  //           address: "621 Pearl St, La Jolla, CA 92037",
  //           description:
  //             "Experience the authentic taste of Mexico at Taco Stand in La Jolla. Enjoy mouthwatering tacos, burritos, and street-style corn.",
  //         },
  //         {
  //           stop_name: "Liberty Public Market",
  //           time_spent: "2 hours",
  //           address: "2820 Historic Decatur Rd, San Diego, CA 92106",
  //           description:
  //             "Explore Liberty Public Market in San Diego, a vibrant marketplace with a variety of food vendors and artisanal treats. Sample gourmet pizzas, craft beers, and delectable desserts.",
  //         },
  //         {
  //           stop_name: "Old Town San Diego",
  //           time_spent: "2.5 hours",
  //           address: "4002 Wallace St, San Diego, CA 92110",
  //           description:
  //             "Conclude your foodie expedition at Old Town San Diego, known for its rich culinary history. Try authentic Mexican dishes, indulge in handmade tortillas, and savor traditional margaritas.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Los Angeles to San Diego, savoring diverse cuisines and mouthwatering treats at every stop. Indulge in LA's famous street tacos, savor the iconic flavors of In-N-Out Burger, and experience authentic Mexican delights at Taco Stand. Explore Liberty Public Market's artisanal treats and conclude your journey in Old Town San Diego, known for its rich culinary history. Get ready for a savory and gastronomic adventure along the Southern California coast.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Getty Center",
  //           time_spent: "3 hours",
  //           address: "1200 Getty Center Dr, Los Angeles, CA 90049",
  //           description:
  //             "Begin your cultural exploration at The Getty Center in Los Angeles, a renowned art museum with an impressive collection of European paintings, sculptures, and decorative arts.",
  //         },
  //         {
  //           stop_name: "Griffith Observatory",
  //           time_spent: "2.5 hours",
  //           address: "2800 E Observatory Rd, Los Angeles, CA 90027",
  //           description:
  //             "Visit Griffith Observatory, an iconic landmark offering stunning views of Los Angeles. Explore exhibits on astronomy and the cosmos, and enjoy the planetarium shows.",
  //         },
  //         {
  //           stop_name: "Old Town San Diego State Historic Park",
  //           time_spent: "2 hours",
  //           address: "4002 Wallace St, San Diego, CA 92110",
  //           description:
  //             "Immerse yourself in the history of California at Old Town San Diego State Historic Park. Discover preserved buildings, museums, and costumed interpreters showcasing the 19th-century life.",
  //         },
  //         {
  //           stop_name: "Balboa Park",
  //           time_spent: "3 hours",
  //           address: "1549 El Prado, San Diego, CA 92101",
  //           description:
  //             "Explore Balboa Park, a cultural oasis in San Diego. Visit museums, gardens, and performing arts venues, including the San Diego Museum of Art and the Old Globe Theatre.",
  //         },
  //         {
  //           stop_name: "Chicano Park",
  //           time_spent: "1.5 hours",
  //           address: "1980 Logan Ave, San Diego, CA 92113",
  //           description:
  //             "Conclude your cultural journey at Chicano Park, a vibrant outdoor art gallery showcasing murals that celebrate the Mexican-American heritage and social justice movements.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Los Angeles to San Diego, exploring art, history, and diverse traditions. Visit The Getty Center's impressive art collection, enjoy the views from Griffith Observatory, and immerse in the history of Old Town San Diego. Explore Balboa Park's museums and gardens, and conclude your journey at Chicano Park's vibrant outdoor art gallery. Get ready to discover the cultural heritage of Southern California along this enriching road trip.",
  //     },
  //   },
  //   "Los-Angeles-to-Las-Vegas": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "Salvation Mountain",
  //           time_spent: "2.5 hours",
  //           address: "Beal Rd, Calipatria, CA 92233",
  //           description:
  //             "Begin your eccentric road trip at Salvation Mountain, a vibrant and surreal art installation in the California desert. Marvel at the colorful folk art and messages of love and hope.",
  //         },
  //         {
  //           stop_name: "Elmer's Bottle Tree Ranch",
  //           time_spent: "1.5 hours",
  //           address: "24266 National Trails Hwy, Oro Grande, CA 92368",
  //           description:
  //             "Visit Elmer's Bottle Tree Ranch, an eccentric and whimsical sculpture garden made of recycled bottles and metal. Wander among the glittering bottle trees and quirky sculptures.",
  //         },
  //         {
  //           stop_name: "Alien Fresh Jerky",
  //           time_spent: "1 hour",
  //           address: "72242 Baker Blvd, Baker, CA 92309",
  //           description:
  //             "Experience the weirdness of Alien Fresh Jerky in Baker. Browse through a variety of alien-themed souvenirs and try unique flavors of jerky, like Martian BBQ and Area 51 Teriyaki.",
  //         },
  //         {
  //           stop_name: "Seven Magic Mountains",
  //           time_spent: "1.5 hours",
  //           address: "S Las Vegas Blvd, Las Vegas, NV 89054",
  //           description:
  //             "Encounter the colorful and towering art installation of Seven Magic Mountains. These stacked boulders painted in bright hues create a surreal and artistic desert experience.",
  //         },
  //         {
  //           stop_name: "The Neon Museum",
  //           time_spent: "2 hours",
  //           address: "770 Las Vegas Blvd N, Las Vegas, NV 89101",
  //           description:
  //             "Conclude your eccentric journey at The Neon Museum in Las Vegas. Explore the boneyard with its collection of vintage neon signs, a quirky tribute to the city's history and culture.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Los Angeles to Las Vegas, encountering quirky attractions and surreal art installations. Marvel at Salvation Mountain's vibrant folk art, wander through Elmer's Bottle Tree Ranch, and experience the weirdness of Alien Fresh Jerky. Witness the colorful Seven Magic Mountains and conclude your journey at The Neon Museum's vintage neon sign boneyard. Get ready for a bizarre and entertaining adventure through the desert.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Joshua Tree National Park",
  //           time_spent: "1.5 days",
  //           address: "74485 National Park Dr, Twentynine Palms, CA 92277",
  //           description:
  //             "Start your nature retreat at Joshua Tree National Park, a unique desert landscape with iconic Joshua trees, rugged rock formations, and stargazing opportunities.",
  //         },
  //         {
  //           stop_name: "Mojave National Preserve",
  //           time_spent: "2 days",
  //           address: "2701 Barstow Rd, Barstow, CA 92311",
  //           description:
  //             "Explore Mojave National Preserve, a serene and vast desert wilderness with sand dunes, volcanic cinder cones, and Joshua tree forests.",
  //         },
  //         {
  //           stop_name: "Red Rock Canyon National Conservation Area",
  //           time_spent: "3 hours",
  //           address: "1000 Scenic Loop Dr, Las Vegas, NV 89161",
  //           description:
  //             "Visit Red Rock Canyon National Conservation Area, known for its stunning red sandstone cliffs and hiking trails offering panoramic views of the Mojave Desert.",
  //         },
  //         {
  //           stop_name: "Valley of Fire State Park",
  //           time_spent: "1 day",
  //           address: "29450 Valley of Fire Hwy, Overton, NV 89040",
  //           description:
  //             "Discover the vibrant colors of Valley of Fire State Park, where sandstone formations create a surreal and photogenic desert landscape.",
  //         },
  //         {
  //           stop_name: "Lake Mead National Recreation Area",
  //           time_spent: "2 days",
  //           address: "601 Nevada Way, Boulder City, NV 89005",
  //           description:
  //             "Conclude your nature-filled journey at Lake Mead National Recreation Area, a haven for water activities and outdoor adventures on the tranquil waters of Lake Mead.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Los Angeles to Las Vegas, exploring national parks and scenic vistas along the way. Discover the unique desert landscapes of Joshua Tree National Park and Mojave National Preserve. Witness the stunning red sandstone cliffs of Red Rock Canyon and the vibrant colors of Valley of Fire State Park. Conclude your journey at Lake Mead National Recreation Area, a serene oasis for water activities. Get ready to immerse yourself in breathtaking desert beauty on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Grand Central Market",
  //           time_spent: "2 hours",
  //           address: "317 S Broadway, Los Angeles, CA 90013",
  //           description:
  //             "Begin your foodie adventure at Grand Central Market in Los Angeles, a bustling food hall offering a wide array of cuisines. Indulge in LA's famous street tacos, gourmet burgers, and international delights.",
  //         },
  //         {
  //           stop_name: "In-N-Out Burger",
  //           time_spent: "1 hour",
  //           address: "9149 S Sepulveda Blvd, Los Angeles, CA 90045",
  //           description:
  //             "Savor the iconic flavors of In-N-Out Burger, a beloved West Coast fast-food chain famous for its fresh and delicious burgers, fries, and milkshakes.",
  //         },
  //         {
  //           stop_name: "The Mad Greek Café",
  //           time_spent: "1.5 hours",
  //           address: "72112 Baker Blvd, Baker, CA 92309",
  //           description:
  //             "Enjoy a taste of Greece at The Mad Greek Café in Baker. Delight in flavorful gyros, Mediterranean salads, and baklava for a sweet treat.",
  //         },
  //         {
  //           stop_name: "Lotus of Siam",
  //           time_spent: "2 hours",
  //           address: "620 E Flamingo Rd, Las Vegas, NV 89119",
  //           description:
  //             "Experience authentic Thai cuisine at Lotus of Siam in Las Vegas. Indulge in a variety of flavorful dishes, including their famous Northern-style specialties.",
  //         },
  //         {
  //           stop_name: "Fremont Street Experience",
  //           time_spent: "2 hours",
  //           address: "425 Fremont St, Las Vegas, NV 89101",
  //           description:
  //             "Conclude your foodie expedition at the Fremont Street Experience in Las Vegas. Explore various food vendors offering a mix of classic and innovative eats to satisfy your cravings.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Los Angeles to Las Vegas, savoring diverse cuisines and mouthwatering treats at every stop. Indulge in LA's famous street tacos, savor the iconic flavors of In-N-Out Burger, and enjoy a taste of Greece at The Mad Greek Café. Experience authentic Thai cuisine at Lotus of Siam and conclude your journey at the Fremont Street Experience, exploring various food vendors. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Getty Center",
  //           time_spent: "3 hours",
  //           address: "1200 Getty Center Dr, Los Angeles, CA 90049",
  //           description:
  //             "Begin your cultural journey at The Getty Center in Los Angeles, a world-class art museum with an extensive collection of European paintings, sculptures, and decorative arts.",
  //         },
  //         {
  //           stop_name: "Hollywood Walk of Fame",
  //           time_spent: "1.5 hours",
  //           address: "Hollywood Blvd & N Highland Ave, Los Angeles, CA 90028",
  //           description:
  //             "Stroll along the Hollywood Walk of Fame, lined with stars honoring iconic figures from the entertainment industry. Experience the glitz and glamour of Hollywood's cultural heritage.",
  //         },
  //         {
  //           stop_name: "Calico Ghost Town",
  //           time_spent: "2 hours",
  //           address: "36600 Ghost Town Rd, Yermo, CA 92398",
  //           description:
  //             "Step back in time at Calico Ghost Town, a former silver mining town turned historical attraction. Explore preserved buildings and artifacts from the Wild West era.",
  //         },
  //         {
  //           stop_name: "The Neon Museum",
  //           time_spent: "2 hours",
  //           address: "770 Las Vegas Blvd N, Las Vegas, NV 89101",
  //           description:
  //             "Visit The Neon Museum in Las Vegas, home to a fascinating collection of vintage neon signs that tell the story of the city's iconic past.",
  //         },
  //         {
  //           stop_name: "The Smith Center for the Performing Arts",
  //           time_spent: "3 hours",
  //           address: "361 Symphony Park Ave, Las Vegas, NV 89106",
  //           description:
  //             "Conclude your cultural journey at The Smith Center for the Performing Arts in Las Vegas. Enjoy world-class performances and immerse yourself in the city's evolving arts scene.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Los Angeles to Las Vegas, exploring arts, history, and diverse traditions. Visit The Getty Center's world-class art collection, experience the glitz of Hollywood Walk of Fame, and step back in time at Calico Ghost Town. Discover The Neon Museum's vintage neon signs and conclude your journey at The Smith Center for the Performing Arts. Get ready to delve into the rich cultural heritage of Southern California and Nevada along this enriching road trip.",
  //     },
  //   },
  //   "Los-Angeles-to-Phoenix": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "Salvation Mountain",
  //           time_spent: "2.5 hours",
  //           address: "Beal Rd, Calipatria, CA 92233",
  //           description:
  //             "Begin your eccentric road trip at Salvation Mountain, a vibrant and surreal art installation in the California desert. Marvel at the colorful folk art and messages of love and hope.",
  //         },
  //         {
  //           stop_name: "The Integratron",
  //           time_spent: "1.5 hours",
  //           address: "2477 Belfield Blvd, Landers, CA 92285",
  //           description:
  //             "Visit The Integratron, an eccentric structure claimed to have healing properties and offer sound baths. Experience the unique acoustics and positive energy within.",
  //         },
  //         {
  //           stop_name: "Cabazon Dinosaurs",
  //           time_spent: "1.5 hours",
  //           address: "50770 Seminole Dr, Cabazon, CA 92230",
  //           description:
  //             "Explore the quirky Cabazon Dinosaurs, featuring a massive T-Rex and a brontosaurus. Climb inside the dinosaur structures for a unique photo opportunity.",
  //         },
  //         {
  //           stop_name: "Arcosanti",
  //           time_spent: "2.5 hours",
  //           address: "13555 S Cross L Rd, Mayer, AZ 86333",
  //           description:
  //             "Discover Arcosanti, an experimental town and architectural wonder. Learn about its unique urban design and sustainable principles.",
  //         },
  //         {
  //           stop_name: "The Mystery Castle",
  //           time_spent: "2 hours",
  //           address: "800 E Mineral Rd, Phoenix, AZ 85042",
  //           description:
  //             "Conclude your eccentric journey at The Mystery Castle in Phoenix. This peculiar and whimsical home was built with recycled materials and holds an intriguing backstory.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Los Angeles to Phoenix, encountering quirky attractions and surreal art installations. Marvel at Salvation Mountain's vibrant folk art, visit The Integratron's unique structure, and explore the quirky Cabazon Dinosaurs. Discover the experimental town of Arcosanti and conclude your journey at The Mystery Castle, a peculiar and whimsical home. Get ready for a weird and entertaining adventure through the desert.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Joshua Tree National Park",
  //           time_spent: "1.5 days",
  //           address: "74485 National Park Dr, Twentynine Palms, CA 92277",
  //           description:
  //             "Start your nature retreat at Joshua Tree National Park, a unique desert landscape with iconic Joshua trees, rugged rock formations, and stargazing opportunities.",
  //         },
  //         {
  //           stop_name: "Palm Springs",
  //           time_spent: "1 day",
  //           address: "Palm Springs, CA",
  //           description:
  //             "Explore the oasis of Palm Springs, known for its beautiful desert scenery, palm-lined streets, and outdoor activities like hiking and golfing.",
  //         },
  //         {
  //           stop_name: "Saguaro National Park",
  //           time_spent: "2 days",
  //           address: "3693 S Old Spanish Trail, Tucson, AZ 85730",
  //           description:
  //             "Experience the beauty of Saguaro National Park, home to the iconic saguaro cacti and diverse desert flora and fauna.",
  //         },
  //         {
  //           stop_name: "Superstition Mountains",
  //           time_spent: "2 days",
  //           address: "Superstition Mountains, AZ",
  //           description:
  //             "Discover the rugged and mysterious Superstition Mountains, offering scenic hikes, historic sites, and legends of lost gold.",
  //         },
  //         {
  //           stop_name: "Camelback Mountain",
  //           time_spent: "4 hours",
  //           address: "E McDonald Dr, Phoenix, AZ 85018",
  //           description:
  //             "Conclude your nature-filled journey at Camelback Mountain, a popular hiking spot in Phoenix. Enjoy panoramic views of the city and surrounding desert landscapes.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Los Angeles to Phoenix, exploring national parks, scenic vistas, and unique desert landscapes. Discover Joshua Tree National Park's iconic Joshua trees, experience the oasis of Palm Springs, and explore the beauty of Saguaro National Park. Discover the rugged Superstition Mountains and conclude your journey at Camelback Mountain with stunning city views. Get ready to immerse yourself in breathtaking desert beauty on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Grand Central Market",
  //           time_spent: "2 hours",
  //           address: "317 S Broadway, Los Angeles, CA 90013",
  //           description:
  //             "Begin your foodie adventure at Grand Central Market in Los Angeles, a bustling food hall offering a wide array of cuisines. Indulge in LA's famous street tacos, gourmet burgers, and international delights.",
  //         },
  //         {
  //           stop_name: "In-N-Out Burger",
  //           time_spent: "1 hour",
  //           address: "9149 S Sepulveda Blvd, Los Angeles, CA 90045",
  //           description:
  //             "Savor the iconic flavors of In-N-Out Burger, a beloved West Coast fast-food chain famous for its fresh and delicious burgers, fries, and milkshakes.",
  //         },
  //         {
  //           stop_name: "La Grande Orange Café",
  //           time_spent: "1.5 hours",
  //           address: "4410 N 40th St, Phoenix, AZ 85018",
  //           description:
  //             "Experience La Grande Orange Café in Phoenix, a chic eatery with a diverse menu offering gourmet sandwiches, artisan pizzas, and fresh salads.",
  //         },
  //         {
  //           stop_name: "Chino Bandido",
  //           time_spent: "1.5 hours",
  //           address: "15414 N 19th Ave, Phoenix, AZ 85023",
  //           description:
  //             "Try the unique fusion cuisine at Chino Bandido, blending Chinese, Mexican, and Caribbean flavors. Enjoy their famous jerk chicken and chile rellenos.",
  //         },
  //         {
  //           stop_name: "The Churchill",
  //           time_spent: "2 hours",
  //           address: "901 N 1st St, Phoenix, AZ 85004",
  //           description:
  //             "Conclude your foodie journey at The Churchill in Phoenix, an innovative food and beverage collective featuring various local eateries and craft breweries.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Los Angeles to Phoenix, savoring diverse cuisines and mouthwatering treats at every stop. Indulge in LA's famous street tacos, savor the iconic flavors of In-N-Out Burger, and experience gourmet dishes at La Grande Orange Café. Try the unique fusion cuisine at Chino Bandido and conclude your journey at The Churchill's food and beverage collective. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Getty Center",
  //           time_spent: "3 hours",
  //           address: "1200 Getty Center Dr, Los Angeles, CA 90049",
  //           description:
  //             "Begin your cultural journey at The Getty Center in Los Angeles, a world-class art museum with an extensive collection of European paintings, sculptures, and decorative arts.",
  //         },
  //         {
  //           stop_name: "Hollywood Walk of Fame",
  //           time_spent: "1.5 hours",
  //           address: "Hollywood Blvd & N Highland Ave, Los Angeles, CA 90028",
  //           description:
  //             "Stroll along the Hollywood Walk of Fame, lined with stars honoring iconic figures from the entertainment industry. Experience the glitz and glamour of Hollywood's cultural heritage.",
  //         },
  //         {
  //           stop_name: "Mission San Xavier del Bac",
  //           time_spent: "2 hours",
  //           address: "1950 W San Xavier Rd, Tucson, AZ 85746",
  //           description:
  //             "Discover the historic Mission San Xavier del Bac, a beautifully preserved Spanish colonial mission with stunning architecture and religious significance.",
  //         },
  //         {
  //           stop_name: "Heard Museum",
  //           time_spent: "2.5 hours",
  //           address: "2301 N Central Ave, Phoenix, AZ 85004",
  //           description:
  //             "Visit the Heard Museum in Phoenix, dedicated to the art and culture of Native American tribes of the Southwest. Explore exhibits, artwork, and traditional crafts.",
  //         },
  //         {
  //           stop_name: "Taliesin West",
  //           time_spent: "2.5 hours",
  //           address: "12621 N Frank Lloyd Wright Blvd, Scottsdale, AZ 85259",
  //           description:
  //             "Conclude your cultural journey at Taliesin West, the winter home and architectural school of Frank Lloyd Wright. Learn about his visionary designs and legacy.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Los Angeles to Phoenix, exploring arts, history, and diverse traditions. Visit The Getty Center's world-class art collection, experience the glitz of Hollywood Walk of Fame, and discover the historic Mission San Xavier del Bac. Immerse in Native American art at Heard Museum and conclude your journey at Taliesin West, showcasing Frank Lloyd Wright's visionary designs. Get ready to delve into the rich cultural heritage of Southern California and Arizona along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Minneapolis": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "House on the Rock",
  //           time_spent: "3 hours",
  //           address: "5754 State Rd 23, Spring Green, WI 53588",
  //           description:
  //             "Begin your eccentric road trip at the House on the Rock, a surreal and eclectic attraction featuring bizarre collections, fantastical architecture, and unique exhibits.",
  //         },
  //         {
  //           stop_name: "Norske Nook",
  //           time_spent: "1.5 hours",
  //           address: "100 E Holum St, De Forest, WI 53532",
  //           description:
  //             "Visit Norske Nook, a Scandinavian-inspired eatery known for its delicious pies. Try their unusual and inventive pie flavors like lingonberry cream and sour cream raisin.",
  //         },
  //         {
  //           stop_name: "SPAM Museum",
  //           time_spent: "2 hours",
  //           address: "101 3rd Ave NE, Austin, MN 55912",
  //           description:
  //             "Explore the SPAM Museum in Austin, MN, dedicated to the iconic canned meat. Discover the history of SPAM, interactive exhibits, and quirky memorabilia.",
  //         },
  //         {
  //           stop_name: "World's Largest Ball of Twine",
  //           time_spent: "1.5 hours",
  //           address: "48484 195th St, Darwin, MN 55324",
  //           description:
  //             "Marvel at the World's Largest Ball of Twine in Darwin, MN. This offbeat attraction is an eccentric feat of yarn-winding that will leave you amused and bewildered.",
  //         },
  //         {
  //           stop_name: "Minneapolis Sculpture Garden",
  //           time_spent: "2.5 hours",
  //           address: "725 Vineland Pl, Minneapolis, MN 55403",
  //           description:
  //             "Conclude your eccentric journey at the Minneapolis Sculpture Garden, featuring an array of quirky and thought-provoking sculptures set amidst beautiful green spaces.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Minneapolis, encountering quirky attractions and offbeat wonders along the way. Explore the surreal House on the Rock, savor unusual pie flavors at Norske Nook, and discover the SPAM Museum. Marvel at the World's Largest Ball of Twine and conclude your journey at the Minneapolis Sculpture Garden with quirky sculptures. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Starved Rock State Park",
  //           time_spent: "1.5 days",
  //           address: "2668 E 875th Rd, Oglesby, IL 61348",
  //           description:
  //             "Start your nature retreat at Starved Rock State Park in Illinois, known for its stunning canyons, waterfalls, and scenic hiking trails along the Illinois River.",
  //         },
  //         {
  //           stop_name: "Wisconsin Dells",
  //           time_spent: "1 day",
  //           address: "Wisconsin Dells, WI",
  //           description:
  //             "Explore the beautiful Wisconsin Dells, famous for its sandstone rock formations and scenic boat tours on the Wisconsin River.",
  //         },
  //         {
  //           stop_name: "Interstate State Park",
  //           time_spent: "2 days",
  //           address: "307 Milltown Rd, Taylors Falls, MN 55084",
  //           description:
  //             "Experience the picturesque Interstate State Park, situated on the St. Croix River and showcasing unique glacial potholes and stunning river views.",
  //         },
  //         {
  //           stop_name: "Lake Pepin",
  //           time_spent: "1 day",
  //           address: "Lake Pepin, MN",
  //           description:
  //             "Relax and enjoy the natural beauty of Lake Pepin, a scenic lake along the Mississippi River, perfect for boating, fishing, and lakeside picnics.",
  //         },
  //         {
  //           stop_name: "Minnehaha Regional Park",
  //           time_spent: "3 hours",
  //           address: "4801 S Minnehaha Dr, Minneapolis, MN 55417",
  //           description:
  //             "Conclude your nature-filled journey at Minnehaha Regional Park in Minneapolis. Admire the 53-foot Minnehaha Falls and explore the beautiful park trails.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Minneapolis, exploring national parks, picturesque lakes, and scenic river views. Discover the stunning canyons of Starved Rock State Park, experience the beauty of Wisconsin Dells, and explore unique glacial potholes at Interstate State Park. Relax by the serene Lake Pepin and conclude your journey at Minnehaha Regional Park with its beautiful waterfall. Get ready to immerse yourself in breathtaking outdoor beauty on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Portillo's",
  //           time_spent: "1.5 hours",
  //           address: "100 W Ontario St, Chicago, IL 60654",
  //           description:
  //             "Begin your foodie adventure at Portillo's in Chicago, a beloved spot for classic Chicago-style hot dogs, Italian beef sandwiches, and rich chocolate cake shakes.",
  //         },
  //         {
  //           stop_name: "Cheese Curds from Wisconsin",
  //           time_spent: "1 hour",
  //           address: "Various locations in Wisconsin",
  //           description:
  //             "Savor the iconic cheese curds from Wisconsin, a local delicacy that's fried to perfection and best enjoyed with dipping sauces.",
  //         },
  //         {
  //           stop_name: "Juicy Lucy at Matt's Bar",
  //           time_spent: "1.5 hours",
  //           address: "3500 Cedar Ave S, Minneapolis, MN 55407",
  //           description:
  //             "Treat yourself to a Juicy Lucy at Matt's Bar in Minneapolis, a cheese-stuffed burger that's a local specialty and a must-try for foodies.",
  //         },
  //         {
  //           stop_name: "Midtown Global Market",
  //           time_spent: "2 hours",
  //           address: "920 E Lake St, Minneapolis, MN 55407",
  //           description:
  //             "Explore the vibrant Midtown Global Market in Minneapolis, featuring an array of international cuisine, from tacos to sushi and everything in between.",
  //         },
  //         {
  //           stop_name: "Glam Doll Donuts",
  //           time_spent: "1 hour",
  //           address: "519 Central Ave NE, Minneapolis, MN 55413",
  //           description:
  //             "Conclude your foodie journey at Glam Doll Donuts in Minneapolis. Indulge in creative and decadent donut flavors, perfect for a sweet ending to your trip.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Chicago to Minneapolis, savoring diverse cuisines and mouthwatering treats at every stop. Enjoy classic Chicago-style hot dogs at Portillo's, savor iconic cheese curds from Wisconsin, and indulge in a Juicy Lucy at Matt's Bar. Explore the international delights of Midtown Global Market and conclude your journey with decadent donuts at Glam Doll Donuts. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at the Art Institute of Chicago, one of the oldest and most renowned art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "Mill City Museum",
  //           time_spent: "2.5 hours",
  //           address: "704 S 2nd St, Minneapolis, MN 55401",
  //           description:
  //             "Visit the Mill City Museum in Minneapolis, housed in the ruins of a historic flour mill. Learn about the city's milling history and its impact on the region's culture and economy.",
  //         },
  //         {
  //           stop_name: "Frank Lloyd Wright Home and Studio",
  //           time_spent: "2 hours",
  //           address: "951 Chicago Ave, Oak Park, IL 60302",
  //           description:
  //             "Explore the Frank Lloyd Wright Home and Studio in Oak Park, a preserved architectural gem showcasing the early works of the renowned architect.",
  //         },
  //         {
  //           stop_name: "Walker Art Center",
  //           time_spent: "3 hours",
  //           address: "725 Vineland Pl, Minneapolis, MN 55403",
  //           description:
  //             "Visit the Walker Art Center in Minneapolis, a contemporary art museum featuring thought-provoking exhibits, modern art collections, and outdoor sculptures.",
  //         },
  //         {
  //           stop_name: "Historic Guthrie Theater",
  //           time_spent: "2 hours",
  //           address: "818 S 2nd St, Minneapolis, MN 55415",
  //           description:
  //             "Conclude your cultural journey at the Historic Guthrie Theater in Minneapolis, a renowned performing arts venue known for its innovative productions and stunning views of the city.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Minneapolis, exploring arts, history, and diverse traditions. Visit the Art Institute of Chicago's world-class art collection, learn about milling history at Mill City Museum, and explore Frank Lloyd Wright's architectural works. Discover modern art at the Walker Art Center and conclude your journey at the Historic Guthrie Theater, known for innovative performances. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Detroit": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "Burlington UFO and Paranormal Center",
  //           time_spent: "2 hours",
  //           address: "400 N Main St, Burlington, WI 53105",
  //           description:
  //             "Begin your eccentric road trip at the Burlington UFO and Paranormal Center, a quirky museum dedicated to extraterrestrial encounters and other paranormal phenomena.",
  //         },
  //         {
  //           stop_name: "Leila's Hair Museum",
  //           time_spent: "1.5 hours",
  //           address: "1333 S Noland Rd, Independence, MO 64055",
  //           description:
  //             "Visit Leila's Hair Museum, an odd and fascinating attraction in Independence, MO, showcasing an extensive collection of hair art and jewelry from the Victorian era.",
  //         },
  //         {
  //           stop_name: "The Heidelberg Project",
  //           time_spent: "2 hours",
  //           address: "3600 Heidelberg St, Detroit, MI 48207",
  //           description:
  //             "Discover The Heidelberg Project in Detroit, an outdoor art installation featuring found objects and colorful sculptures that transform abandoned houses into an artistic wonderland.",
  //         },
  //         {
  //           stop_name: "The Great Lakes Floating Maritime Museum",
  //           time_spent: "2.5 hours",
  //           address: "1701 Water St, Port Huron, MI 48060",
  //           description:
  //             "Explore The Great Lakes Floating Maritime Museum in Port Huron, MI, where you can board a decommissioned lightship and learn about the maritime history of the Great Lakes.",
  //         },
  //         {
  //           stop_name: "The Motown Museum",
  //           time_spent: "2 hours",
  //           address: "2648 W Grand Blvd, Detroit, MI 48208",
  //           description:
  //             "Conclude your eccentric journey at The Motown Museum in Detroit, celebrating the iconic record label that produced legendary music acts and played a significant role in American music history.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Detroit, encountering quirky attractions and offbeat wonders along the way. Visit the Burlington UFO and Paranormal Center, explore hair art at Leila's Hair Museum, and discover The Heidelberg Project's outdoor art installations. Learn about the maritime history of the Great Lakes at The Great Lakes Floating Maritime Museum and conclude your journey at The Motown Museum. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Indiana Dunes National Park",
  //           time_spent: "1.5 days",
  //           address: "1100 N Mineral Springs Rd, Porter, IN 46304",
  //           description:
  //             "Start your nature retreat at Indiana Dunes National Park, a beautiful area along Lake Michigan with sand dunes, hiking trails, and stunning lakeshore views.",
  //         },
  //         {
  //           stop_name: "Warren Dunes State Park",
  //           time_spent: "1 day",
  //           address: "12032 Red Arrow Hwy, Sawyer, MI 49125",
  //           description:
  //             "Explore Warren Dunes State Park, a picturesque park in Michigan, featuring sandy beaches, towering dunes, and nature trails.",
  //         },
  //         {
  //           stop_name: "Huron-Manistee National Forests",
  //           time_spent: "2 days",
  //           address: "1755 S Mitchell St, Cadillac, MI 49601",
  //           description:
  //             "Experience the beauty of Huron-Manistee National Forests, a vast wilderness area with scenic rivers, forests, and opportunities for hiking, camping, and wildlife watching.",
  //         },
  //         {
  //           stop_name: "Sleeping Bear Dunes National Lakeshore",
  //           time_spent: "1.5 days",
  //           address: "9922 Front St, Empire, MI 49630",
  //           description:
  //             "Discover Sleeping Bear Dunes National Lakeshore, a breathtaking area along Lake Michigan, known for its towering dunes, pristine beaches, and diverse natural landscapes.",
  //         },
  //         {
  //           stop_name: "Belle Isle Park",
  //           time_spent: "4 hours",
  //           address: "2 Inselruhe Ave, Detroit, MI 48207",
  //           description:
  //             "Conclude your nature-filled journey at Belle Isle Park in Detroit, a beautiful island park with gardens, trails, and waterfront views along the Detroit River.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Detroit, exploring national parks, serene lakeshores, and beautiful gardens. Discover the sand dunes of Indiana Dunes National Park, explore Warren Dunes State Park's sandy beaches, and experience the beauty of Huron-Manistee National Forests. Visit Sleeping Bear Dunes National Lakeshore's breathtaking landscapes and conclude your journey at Belle Isle Park with waterfront views. Get ready to immerse yourself in the natural beauty of the Midwest on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Lou Malnati's Pizzeria",
  //           time_spent: "1.5 hours",
  //           address: "805 S State St, Chicago, IL 60605",
  //           description:
  //             "Begin your foodie adventure at Lou Malnati's Pizzeria in Chicago, renowned for its deep-dish Chicago-style pizza, featuring a buttery crust, loads of cheese, and delicious toppings.",
  //         },
  //         {
  //           stop_name: "Zingerman's Delicatessen",
  //           time_spent: "1.5 hours",
  //           address: "422 Detroit St, Ann Arbor, MI 48104",
  //           description:
  //             "Savor the delectable sandwiches and artisan cheeses at Zingerman's Delicatessen in Ann Arbor, MI. This iconic deli is a foodie haven with high-quality, flavorful eats.",
  //         },
  //         {
  //           stop_name: "Coney Island Hot Dogs",
  //           time_spent: "1 hour",
  //           address: "Various locations in Detroit, MI",
  //           description:
  //             "Taste the famous Coney Island hot dogs in Detroit, a local specialty topped with chili, onions, and mustard, served at classic Coney Island diners throughout the city.",
  //         },
  //         {
  //           stop_name: "Slows Bar BQ",
  //           time_spent: "2 hours",
  //           address: "2138 Michigan Ave, Detroit, MI 48216",
  //           description:
  //             "Feast on slow-cooked and flavorful barbecue dishes at Slows Bar BQ in Detroit. Indulge in tender ribs, pulled pork, and a variety of mouthwatering sides.",
  //         },
  //         {
  //           stop_name: "Astoria Pastry Shop",
  //           time_spent: "1 hour",
  //           address: "541 Monroe Ave, Detroit, MI 48226",
  //           description:
  //             "Conclude your foodie journey at Astoria Pastry Shop in Detroit, offering a delightful array of pastries, cakes, and sweets perfect for satisfying your sweet tooth.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Chicago to Detroit, savoring diverse cuisines and mouthwatering treats at every stop. Enjoy Lou Malnati's famous deep-dish pizza in Chicago, savor sandwiches at Zingerman's Delicatessen in Ann Arbor, and taste the iconic Coney Island hot dogs in Detroit. Indulge in flavorful barbecue at Slows Bar BQ and conclude your journey with delectable pastries at Astoria Pastry Shop. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at The Art Institute of Chicago, one of the oldest and largest art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "The Henry Ford Museum",
  //           time_spent: "4 hours",
  //           address: "20900 Oakwood Blvd, Dearborn, MI 48124",
  //           description:
  //             "Visit The Henry Ford Museum in Dearborn, MI, showcasing a vast collection of Americana, historical artifacts, and exhibits that celebrate American innovation and culture.",
  //         },
  //         {
  //           stop_name: "Chicago Cultural Center",
  //           time_spent: "2.5 hours",
  //           address: "78 E Washington St, Chicago, IL 60602",
  //           description:
  //             "Explore the Chicago Cultural Center, a landmark building with diverse cultural programs, art exhibitions, and performances representing the artistic heritage of Chicago.",
  //         },
  //         {
  //           stop_name: "Motown Museum",
  //           time_spent: "2 hours",
  //           address: "2648 W Grand Blvd, Detroit, MI 48208",
  //           description:
  //             "Discover the Motown Museum in Detroit, celebrating the iconic record label that produced legendary music acts and played a significant role in American music history.",
  //         },
  //         {
  //           stop_name: "Detroit Institute of Arts",
  //           time_spent: "3 hours",
  //           address: "5200 Woodward Ave, Detroit, MI 48202",
  //           description:
  //             "Conclude your cultural journey at the Detroit Institute of Arts, home to a diverse collection of art from different cultures and time periods, including masterpieces by renowned artists.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Detroit, exploring arts, history, and diverse traditions. Visit The Art Institute of Chicago's world-class art collection, experience The Henry Ford Museum's Americana exhibits, and explore Chicago Cultural Center's diverse programs. Discover the Motown Museum and conclude your journey at the Detroit Institute of Arts with its impressive art collection. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-St-Louis": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "The International Museum of Surgical Science",
  //           time_spent: "2 hours",
  //           address: "1524 N Lake Shore Dr, Chicago, IL 60610",
  //           description:
  //             "Begin your eccentric road trip at The International Museum of Surgical Science in Chicago, a unique museum showcasing the history and art of surgery and medical instruments.",
  //         },
  //         {
  //           stop_name: "The World's Largest Catsup Bottle",
  //           time_spent: "1 hour",
  //           address: "800 S Morrison Ave, Collinsville, IL 62234",
  //           description:
  //             "Visit The World's Largest Catsup Bottle in Collinsville, IL, a quirky roadside attraction that pays homage to America's love for ketchup.",
  //         },
  //         {
  //           stop_name: "City Museum",
  //           time_spent: "3 hours",
  //           address: "750 N 16th St, St. Louis, MO 63103",
  //           description:
  //             "Explore City Museum in St. Louis, an eclectic and interactive playground built from repurposed architectural and industrial objects, perfect for all ages.",
  //         },
  //         {
  //           stop_name: "Crown Candy Kitchen",
  //           time_spent: "1.5 hours",
  //           address: "1401 St Louis Ave, St. Louis, MO 63106",
  //           description:
  //             "Indulge in sweet treats at Crown Candy Kitchen, a historic St. Louis institution known for its delicious malts, ice creams, and old-fashioned soda fountain.",
  //         },
  //         {
  //           stop_name: "The Museum of Mirth, Mystery, and Mayhem",
  //           time_spent: "2 hours",
  //           address: "510 N Broadway, St. Louis, MO 63102",
  //           description:
  //             "Conclude your eccentric journey at The Museum of Mirth, Mystery, and Mayhem in St. Louis, a quirky and offbeat museum celebrating the strange, mysterious, and whimsical.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to St. Louis, encountering quirky attractions and offbeat wonders along the way. Visit The International Museum of Surgical Science, marvel at The World's Largest Catsup Bottle, and explore the interactive City Museum. Indulge in sweet treats at Crown Candy Kitchen and conclude your journey at The Museum of Mirth, Mystery, and Mayhem. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Starved Rock State Park",
  //           time_spent: "1.5 days",
  //           address: "2668 E 875th Rd, Oglesby, IL 61348",
  //           description:
  //             "Start your nature retreat at Starved Rock State Park in Illinois, known for its stunning canyons, waterfalls, and scenic hiking trails along the Illinois River.",
  //         },
  //         {
  //           stop_name: "Shawnee National Forest",
  //           time_spent: "2 days",
  //           address: "50 Hwy 145 S, Harrisburg, IL 62946",
  //           description:
  //             "Explore the beauty of Shawnee National Forest, a sprawling forested area with rugged bluffs, picturesque trails, and the stunning Garden of the Gods rock formations.",
  //         },
  //         {
  //           stop_name: "Meramec Caverns",
  //           time_spent: "1.5 days",
  //           address: "1135 Hwy W, Sullivan, MO 63080",
  //           description:
  //             "Visit Meramec Caverns in Missouri, a fascinating underground cave system with impressive rock formations, guided tours, and a rich history.",
  //         },
  //         {
  //           stop_name: "Missouri Botanical Garden",
  //           time_spent: "3 hours",
  //           address: "4344 Shaw Blvd, St. Louis, MO 63110",
  //           description:
  //             "Stroll through the beautiful Missouri Botanical Garden in St. Louis, featuring an array of gardens, conservatories, and plant collections from around the world.",
  //         },
  //         {
  //           stop_name: "Gateway Arch National Park",
  //           time_spent: "2 hours",
  //           address: "11 N 4th St, St. Louis, MO 63102",
  //           description:
  //             "Conclude your nature-filled journey at Gateway Arch National Park in St. Louis, where you can enjoy scenic views of the Mississippi River and the iconic Gateway Arch.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to St. Louis, exploring national parks, scenic rivers, and beautiful gardens. Discover the stunning canyons of Starved Rock State Park, experience the rugged beauty of Shawnee National Forest, and explore the fascinating Meramec Caverns. Stroll through the Missouri Botanical Garden and conclude your journey with scenic views at Gateway Arch National Park. Get ready to immerse yourself in breathtaking outdoor beauty on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "The Publican",
  //           time_spent: "2 hours",
  //           address: "837 W Fulton Market, Chicago, IL 60607",
  //           description:
  //             "Begin your foodie adventure at The Publican in Chicago, a beloved gastropub known for its farm-to-table approach, craft beer selection, and delectable pork dishes.",
  //         },
  //         {
  //           stop_name: "Funky Buddha Lounge",
  //           time_spent: "1.5 hours",
  //           address: "728 Grand Blvd, St. Louis, MO 63103",
  //           description:
  //             "Experience the unique flavors of the Funky Buddha Lounge in St. Louis, offering eclectic small plates, craft cocktails, and a vibrant atmosphere.",
  //         },
  //         {
  //           stop_name: "Pappy's Smokehouse",
  //           time_spent: "1.5 hours",
  //           address: "3106 Olive St, St. Louis, MO 63103",
  //           description:
  //             "Indulge in mouthwatering barbecue at Pappy's Smokehouse in St. Louis, famous for its slow-smoked meats, savory dry rubs, and delicious side dishes.",
  //         },
  //         {
  //           stop_name: "Gus's World Famous Fried Chicken",
  //           time_spent: "1 hour",
  //           address: "7434 Manchester Rd, St. Louis, MO 63143",
  //           description:
  //             "Savor the unforgettable flavor of Gus's World Famous Fried Chicken in St. Louis, known for its crispy, spicy, and perfectly seasoned fried chicken.",
  //         },
  //         {
  //           stop_name: "Ted Drewes Frozen Custard",
  //           time_spent: "1 hour",
  //           address: "6726 Chippewa St, St. Louis, MO 63109",
  //           description:
  //             "Conclude your foodie journey at Ted Drewes Frozen Custard in St. Louis, a classic custard stand serving rich and creamy frozen custard in various flavors and toppings.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Chicago to St. Louis, savoring diverse cuisines and mouthwatering treats at every stop. Enjoy farm-to-table delights at The Publican, experience eclectic flavors at Funky Buddha Lounge, and indulge in barbecue at Pappy's Smokehouse. Savor Gus's World Famous Fried Chicken and conclude your journey with creamy frozen custard at Ted Drewes. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at The Art Institute of Chicago, one of the oldest and largest art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "Frank Lloyd Wright Home and Studio",
  //           time_spent: "2 hours",
  //           address: "951 Chicago Ave, Oak Park, IL 60302",
  //           description:
  //             "Explore the Frank Lloyd Wright Home and Studio in Oak Park, a preserved architectural gem showcasing the early works of the renowned architect.",
  //         },
  //         {
  //           stop_name: "Cathedral Basilica of Saint Louis",
  //           time_spent: "1.5 hours",
  //           address: "4431 Lindell Blvd, St. Louis, MO 63108",
  //           description:
  //             "Visit the Cathedral Basilica of Saint Louis, an awe-inspiring cathedral known for its stunning mosaics, intricate architecture, and spiritual significance.",
  //         },
  //         {
  //           stop_name: "The Missouri History Museum",
  //           time_spent: "2.5 hours",
  //           address: "5700 Lindell Blvd, St. Louis, MO 63112",
  //           description:
  //             "Immerse yourself in the history of Missouri at The Missouri History Museum in St. Louis, featuring engaging exhibits and artifacts from the region's past.",
  //         },
  //         {
  //           stop_name: "The Gateway Arch",
  //           time_spent: "2 hours",
  //           address: "11 N 4th St, St. Louis, MO 63102",
  //           description:
  //             "Conclude your cultural journey at The Gateway Arch in St. Louis, an iconic monument and symbol of American westward expansion, offering breathtaking views of the city and the Mississippi River.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to St. Louis, exploring arts, history, and diverse traditions. Visit The Art Institute of Chicago's world-class art collection, explore Frank Lloyd Wright's architectural works, and experience the spiritual significance of the Cathedral Basilica of Saint Louis. Immerse yourself in Missouri's history at The Missouri History Museum and conclude your journey at The Gateway Arch with breathtaking views. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Indianapolis": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "The International Museum of Surgical Science",
  //           time_spent: "2 hours",
  //           address: "1524 N Lake Shore Dr, Chicago, IL 60610",
  //           description:
  //             "Begin your eccentric road trip at The International Museum of Surgical Science in Chicago, a unique museum showcasing the history and art of surgery and medical instruments.",
  //         },
  //         {
  //           stop_name: "Giant Wind Chimes",
  //           time_spent: "1 hour",
  //           address: "7356 N Harlem Ave, Chicago, IL 60631",
  //           description:
  //             "Experience the mesmerizing sounds of the Giant Wind Chimes in Chicago, an outdoor art installation featuring giant musical chimes that you can play and enjoy.",
  //         },
  //         {
  //           stop_name: "World's Largest Rocking Chair",
  //           time_spent: "1 hour",
  //           address: "805 S Main St, Casey, IL 62420",
  //           description:
  //             "Marvel at the World's Largest Rocking Chair in Casey, IL, a quirky roadside attraction that will take you back to your childhood with its impressive size.",
  //         },
  //         {
  //           stop_name: "The Museum of Psychphonics",
  //           time_spent: "2 hours",
  //           address: "1100 Oliver Ave, Indianapolis, IN 46221",
  //           description:
  //             "Discover The Museum of Psychphonics in Indianapolis, a unique and surreal museum dedicated to exploring the connection between sound, art, and the human mind.",
  //         },
  //         {
  //           stop_name: "Kurt Vonnegut Museum and Library",
  //           time_spent: "1.5 hours",
  //           address: "543 Indiana Ave, Indianapolis, IN 46202",
  //           description:
  //             "Conclude your eccentric journey at the Kurt Vonnegut Museum and Library in Indianapolis, celebrating the life and works of the iconic author Kurt Vonnegut in an unconventional and literary atmosphere.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Indianapolis, encountering quirky attractions and offbeat wonders along the way. Visit The International Museum of Surgical Science, play the Giant Wind Chimes in Chicago, and marvel at the World's Largest Rocking Chair in Casey. Discover The Museum of Psychphonics in Indianapolis, and conclude your journey at the Kurt Vonnegut Museum and Library. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Indiana Dunes National Park",
  //           time_spent: "1.5 days",
  //           address: "1100 N Mineral Springs Rd, Porter, IN 46304",
  //           description:
  //             "Start your nature retreat at Indiana Dunes National Park, a beautiful area along Lake Michigan with sand dunes, hiking trails, and stunning lakeshore views.",
  //         },
  //         {
  //           stop_name: "Turkey Run State Park",
  //           time_spent: "2 days",
  //           address: "8121 Park Rd, Marshall, IN 47859",
  //           description:
  //             "Explore the rugged beauty of Turkey Run State Park, known for its deep sandstone ravines, scenic trails, and opportunities for hiking and rock climbing.",
  //         },
  //         {
  //           stop_name: "Brown County State Park",
  //           time_spent: "1.5 days",
  //           address: "1810 IN-46, Nashville, IN 47448",
  //           description:
  //             "Experience the natural charm of Brown County State Park, an enchanting park with rolling hills, vibrant forests, and picturesque vistas, especially during fall foliage.",
  //         },
  //         {
  //           stop_name: "Holliday Park",
  //           time_spent: "2 hours",
  //           address: "6363 Spring Mill Rd, Indianapolis, IN 46260",
  //           description:
  //             "Visit Holliday Park in Indianapolis, a tranquil oasis with nature trails, gardens, and a beautiful nature center, perfect for a relaxing stroll.",
  //         },
  //         {
  //           stop_name: "White River State Park",
  //           time_spent: "3 hours",
  //           address: "801 W Washington St, Indianapolis, IN 46204",
  //           description:
  //             "Conclude your nature-filled journey at White River State Park in Indianapolis, offering scenic river views, walking paths, and green spaces in the heart of the city.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Indianapolis, exploring national parks, serene lakeshores, and beautiful gardens. Discover the sand dunes of Indiana Dunes National Park, experience the rugged beauty of Turkey Run State Park, and explore the natural charm of Brown County State Park. Visit Holliday Park in Indianapolis and conclude your journey at White River State Park, a tranquil oasis in the heart of the city. Get ready to immerse yourself in breathtaking outdoor beauty on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Girl & the Goat",
  //           time_spent: "2 hours",
  //           address: "809 W Randolph St, Chicago, IL 60607",
  //           description:
  //             "Begin your foodie adventure at Girl & the Goat in Chicago, an award-winning restaurant offering creative dishes with a focus on seasonal ingredients and bold flavors.",
  //         },
  //         {
  //           stop_name: "The Tamale Place",
  //           time_spent: "1 hour",
  //           address: "5226 Rockville Rd, Indianapolis, IN 46224",
  //           description:
  //             "Treat yourself to authentic Mexican tamales at The Tamale Place in Indianapolis, known for its flavorful fillings and handcrafted corn husk wraps.",
  //         },
  //         {
  //           stop_name: "Milktooth",
  //           time_spent: "1.5 hours",
  //           address: "534 Virginia Ave, Indianapolis, IN 46203",
  //           description:
  //             "Experience brunch like never before at Milktooth in Indianapolis, a trendy eatery serving inventive dishes and artisanal coffee in a stylish setting.",
  //         },
  //         {
  //           stop_name: "St. Elmo Steak House",
  //           time_spent: "2 hours",
  //           address: "127 S Illinois St, Indianapolis, IN 46225",
  //           description:
  //             "Indulge in a classic steak dinner at St. Elmo Steak House in Indianapolis, a legendary establishment renowned for its flavorful cuts and signature shrimp cocktail.",
  //         },
  //         {
  //           stop_name: "Long's Bakery",
  //           time_spent: "30 minutes",
  //           address: "1453 N Tremont St, Indianapolis, IN 46222",
  //           description:
  //             "Conclude your foodie journey at Long's Bakery in Indianapolis, a beloved local institution serving delectable donuts and pastries since 1955.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Chicago to Indianapolis, savoring diverse cuisines and mouthwatering treats at every stop. Enjoy bold flavors at Girl & the Goat in Chicago, savor authentic Mexican tamales at The Tamale Place, and experience inventive brunch at Milktooth. Indulge in a classic steak dinner at St. Elmo Steak House and conclude your journey with delectable donuts at Long's Bakery. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at The Art Institute of Chicago, one of the oldest and largest art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "Frank Lloyd Wright Home and Studio",
  //           time_spent: "2 hours",
  //           address: "951 Chicago Ave, Oak Park, IL 60302",
  //           description:
  //             "Explore the Frank Lloyd Wright Home and Studio in Oak Park, a preserved architectural gem showcasing the early works of the renowned architect.",
  //         },
  //         {
  //           stop_name: "Indiana State Museum",
  //           time_spent: "2.5 hours",
  //           address: "650 W Washington St, Indianapolis, IN 46204",
  //           description:
  //             "Discover the history, art, and culture of Indiana at the Indiana State Museum in Indianapolis, featuring fascinating exhibits and artifacts from the state's past.",
  //         },
  //         {
  //           stop_name: "Eiteljorg Museum",
  //           time_spent: "2 hours",
  //           address: "500 W Washington St, Indianapolis, IN 46204",
  //           description:
  //             "Immerse yourself in Native American and Western art at the Eiteljorg Museum in Indianapolis, showcasing diverse works that celebrate the American West.",
  //         },
  //         {
  //           stop_name: "The Children's Museum of Indianapolis",
  //           time_spent: "4 hours",
  //           address: "3000 N Meridian St, Indianapolis, IN 46208",
  //           description:
  //             "Conclude your cultural journey at The Children's Museum of Indianapolis, the world's largest children's museum, with interactive exhibits covering science, culture, and history.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Indianapolis, exploring arts, history, and diverse traditions. Visit The Art Institute of Chicago's world-class art collection, explore Frank Lloyd Wright's architectural works, and discover Indiana's history at the Indiana State Museum. Immerse yourself in Native American art at the Eiteljorg Museum and conclude your journey at The Children's Museum of Indianapolis, a fascinating educational experience for all ages. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Milwaukee": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "International Museum of Surgical Science",
  //           time_spent: "2 hours",
  //           address: "1524 N Lake Shore Dr, Chicago, IL 60610",
  //           description:
  //             "Begin your eccentric road trip at the International Museum of Surgical Science in Chicago, a unique museum showcasing the history and art of surgery and medical instruments.",
  //         },
  //         {
  //           stop_name: "BAPS Shri Swaminarayan Mandir",
  //           time_spent: "1.5 hours",
  //           address: "N4063 W243 Pewaukee Rd, Pewaukee, WI 53072",
  //           description:
  //             "Visit BAPS Shri Swaminarayan Mandir in Pewaukee, WI, a stunning Hindu temple with intricately carved marble and cultural exhibitions.",
  //         },
  //         {
  //           stop_name: "The House on the Rock",
  //           time_spent: "3 hours",
  //           address: "5754 State Road 23, Spring Green, WI 53588",
  //           description:
  //             "Explore The House on the Rock in Spring Green, WI, an eccentric attraction with eclectic collections, massive rooms, and breathtaking views.",
  //         },
  //         {
  //           stop_name: "Safe House",
  //           time_spent: "2 hours",
  //           address: "779 N Front St, Milwaukee, WI 53202",
  //           description:
  //             "Experience the intriguing Safe House in Milwaukee, a spy-themed restaurant and bar with secret passageways and interactive espionage.",
  //         },
  //         {
  //           stop_name: "American Science & Surplus",
  //           time_spent: "1.5 hours",
  //           address: "6901 W Oklahoma Ave, Milwaukee, WI 53219",
  //           description:
  //             "Conclude your eccentric journey at American Science & Surplus in Milwaukee, a quirky store offering an assortment of unusual and practical items.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Milwaukee, encountering quirky attractions and offbeat wonders along the way. Visit the International Museum of Surgical Science in Chicago, explore BAPS Shri Swaminarayan Mandir, and experience The House on the Rock in Spring Green. Have a thrilling time at the Safe House in Milwaukee and conclude your journey at American Science & Surplus. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Illinois Beach State Park",
  //           time_spent: "1.5 days",
  //           address: "1 Lakefront Dr, Zion, IL 60099",
  //           description:
  //             "Start your nature retreat at Illinois Beach State Park, a beautiful park along Lake Michigan with sandy beaches, hiking trails, and birdwatching opportunities.",
  //         },
  //         {
  //           stop_name: "Richard Bong State Recreation Area",
  //           time_spent: "2 days",
  //           address: "26313 Burlington Rd, Kansasville, WI 53139",
  //           description:
  //             "Explore the natural beauty of Richard Bong State Recreation Area, offering hiking trails, fishing, and wildlife viewing in a peaceful setting.",
  //         },
  //         {
  //           stop_name: "Boerner Botanical Gardens",
  //           time_spent: "1.5 hours",
  //           address: "9400 Boerner Dr, Hales Corners, WI 53130",
  //           description:
  //             "Stroll through the picturesque Boerner Botanical Gardens, featuring a wide variety of gardens, plant collections, and scenic landscapes.",
  //         },
  //         {
  //           stop_name: "Seven Bridges Trail",
  //           time_spent: "2 hours",
  //           address: "South Kinnickinnic Ave, Milwaukee, WI 53207",
  //           description:
  //             "Enjoy a refreshing hike along the Seven Bridges Trail in Milwaukee's Grant Park, where you'll cross wooden bridges and enjoy views of Lake Michigan.",
  //         },
  //         {
  //           stop_name: "Havenwoods State Forest",
  //           time_spent: "2 hours",
  //           address: "6141 N Hopkins St, Milwaukee, WI 53209",
  //           description:
  //             "Conclude your nature-filled journey at Havenwoods State Forest, a hidden gem in Milwaukee with walking trails, wildlife, and a peaceful natural setting.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Milwaukee, exploring parks, gardens, and scenic lakeshores. Discover the sandy beaches of Illinois Beach State Park, explore the natural beauty of Richard Bong State Recreation Area, and stroll through the picturesque Boerner Botanical Gardens. Enjoy a hike along the Seven Bridges Trail in Milwaukee's Grant Park and conclude your journey at Havenwoods State Forest. Get ready to immerse yourself in breathtaking outdoor beauty on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Alinea",
  //           time_spent: "3 hours",
  //           address: "1723 N Halsted St, Chicago, IL 60614",
  //           description:
  //             "Begin your foodie adventure at Alinea in Chicago, a Michelin-starred restaurant known for its innovative and artistic dishes that elevate the dining experience.",
  //         },
  //         {
  //           stop_name: "Kopp's Frozen Custard",
  //           time_spent: "1 hour",
  //           address: "18880 W Bluemound Rd, Brookfield, WI 53045",
  //           description:
  //             "Treat yourself to delectable frozen custard at Kopp's Frozen Custard in Brookfield, WI, where flavors change daily and each one is as delightful as the next.",
  //         },
  //         {
  //           stop_name: "Milwaukee Public Market",
  //           time_spent: "2 hours",
  //           address: "400 N Water St, Milwaukee, WI 53202",
  //           description:
  //             "Experience a culinary delight at Milwaukee Public Market, where you can sample a variety of local foods, artisanal products, and specialty ingredients.",
  //         },
  //         {
  //           stop_name: "Lakefront Brewery",
  //           time_spent: "1.5 hours",
  //           address: "1872 N Commerce St, Milwaukee, WI 53212",
  //           description:
  //             "Indulge in craft beer and brewery bites at Lakefront Brewery in Milwaukee, known for its beer tours, lakefront views, and delicious pub fare.",
  //         },
  //         {
  //           stop_name: "BelAir Cantina",
  //           time_spent: "1.5 hours",
  //           address: "1935 N Water St, Milwaukee, WI 53202",
  //           description:
  //             "Conclude your foodie journey at BelAir Cantina in Milwaukee, a vibrant taqueria offering creative and mouthwatering tacos, along with refreshing cocktails.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a mouthwatering foodie road trip from Chicago to Milwaukee, savoring diverse cuisines and delicious treats at every stop. Enjoy the innovative dishes at Alinea in Chicago, indulge in delectable frozen custard at Kopp's Frozen Custard, and experience a variety of local foods at Milwaukee Public Market. Sample craft beer at Lakefront Brewery, and conclude your journey with creative tacos at BelAir Cantina. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at The Art Institute of Chicago, one of the oldest and largest art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "Frank Lloyd Wright Home and Studio",
  //           time_spent: "2 hours",
  //           address: "951 Chicago Ave, Oak Park, IL 60302",
  //           description:
  //             "Explore the Frank Lloyd Wright Home and Studio in Oak Park, a preserved architectural gem showcasing the early works of the renowned architect.",
  //         },
  //         {
  //           stop_name: "Milwaukee Art Museum",
  //           time_spent: "2.5 hours",
  //           address: "700 N Art Museum Dr, Milwaukee, WI 53202",
  //           description:
  //             "Discover the art and culture of Milwaukee at the Milwaukee Art Museum, featuring a diverse collection of over 30,000 works, including contemporary art and American decorative arts.",
  //         },
  //         {
  //           stop_name: "Historic Third Ward",
  //           time_spent: "2 hours",
  //           address: "Milwaukee, WI 53202",
  //           description:
  //             "Explore the Historic Third Ward in Milwaukee, a vibrant neighborhood known for its art galleries, boutique shops, and historic warehouses that have been converted into trendy spaces.",
  //         },
  //         {
  //           stop_name: "Harley-Davidson Museum",
  //           time_spent: "3 hours",
  //           address: "400 W Canal St, Milwaukee, WI 53201",
  //           description:
  //             "Conclude your cultural journey at the Harley-Davidson Museum in Milwaukee, celebrating the iconic American motorcycle brand with exhibits on its history and cultural impact.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Milwaukee, exploring arts, history, and diverse traditions. Visit The Art Institute of Chicago's world-class art collection, explore Frank Lloyd Wright's architectural works, and discover the art and culture of Milwaukee at the Milwaukee Art Museum. Immerse yourself in the vibrant Historic Third Ward, and conclude your journey at the Harley-Davidson Museum, celebrating the cultural impact of the iconic American motorcycle brand. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Cleveland": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "International Museum of Surgical Science",
  //           time_spent: "2 hours",
  //           address: "1524 N Lake Shore Dr, Chicago, IL 60610",
  //           description:
  //             "Begin your eccentric road trip at the International Museum of Surgical Science in Chicago, a unique museum showcasing the history and art of surgery and medical instruments.",
  //         },
  //         {
  //           stop_name: "Leaning Tower of Niles",
  //           time_spent: "1 hour",
  //           address: "6300 W Touhy Ave, Niles, IL 60714",
  //           description:
  //             "See the quirky Leaning Tower of Niles, a half-size replica of the Leaning Tower of Pisa, standing tall in a park in Niles, IL.",
  //         },
  //         {
  //           stop_name: "America's Largest Cuckoo Clock",
  //           time_spent: "30 minutes",
  //           address: "400 S Logan St, West Frankfort, IL 62896",
  //           description:
  //             "Marvel at America's Largest Cuckoo Clock in West Frankfort, IL, an oversized cuckoo clock that surprises visitors with its hourly shows.",
  //         },
  //         {
  //           stop_name: "House of Wills Funeral Home",
  //           time_spent: "1 hour",
  //           address: "2491 E 55th St, Cleveland, OH 44104",
  //           description:
  //             "Visit the House of Wills Funeral Home in Cleveland, a historic and eccentric funeral home that has hosted many notable funerals.",
  //         },
  //         {
  //           stop_name: "A Christmas Story House",
  //           time_spent: "2 hours",
  //           address: "3159 W 11th St, Cleveland, OH 44109",
  //           description:
  //             "Conclude your eccentric journey at the A Christmas Story House in Cleveland, where the classic holiday movie comes to life, and you can even take a tour.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Cleveland, encountering quirky attractions and offbeat wonders along the way. Visit the International Museum of Surgical Science in Chicago, see the Leaning Tower of Niles, and marvel at America's Largest Cuckoo Clock in West Frankfort. Visit the House of Wills Funeral Home in Cleveland and conclude your journey at the A Christmas Story House. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Starved Rock State Park",
  //           time_spent: "1.5 days",
  //           address: "2668 E 875th Rd, Oglesby, IL 61348",
  //           description:
  //             "Start your nature retreat at Starved Rock State Park, a picturesque park along the Illinois River with canyons, waterfalls, and hiking trails through lush forests.",
  //         },
  //         {
  //           stop_name: "Indiana Dunes National Park",
  //           time_spent: "2 days",
  //           address: "1100 N Mineral Springs Rd, Porter, IN 46304",
  //           description:
  //             "Explore the sandy shores and diverse ecosystems of Indiana Dunes National Park, offering beautiful beaches and scenic vistas along Lake Michigan.",
  //         },
  //         {
  //           stop_name: "Cuyahoga Valley National Park",
  //           time_spent: "2 days",
  //           address: "Cuyahoga Valley National Park, Brecksville, OH 44141",
  //           description:
  //             "Discover the natural beauty of Cuyahoga Valley National Park, where you can hike, bike, and explore waterfalls amidst a backdrop of forests and meadows.",
  //         },
  //         {
  //           stop_name: "Holden Arboretum",
  //           time_spent: "3 hours",
  //           address: "9500 Sperry Rd, Kirtland, OH 44094",
  //           description:
  //             "Stroll through the expansive Holden Arboretum, featuring beautiful gardens, forest trails, and a canopy walk for an immersive nature experience.",
  //         },
  //         {
  //           stop_name: "Lake View Cemetery",
  //           time_spent: "1.5 hours",
  //           address: "12316 Euclid Ave, Cleveland, OH 44106",
  //           description:
  //             "Conclude your nature-filled journey at Lake View Cemetery in Cleveland, a historic and picturesque cemetery offering peaceful green spaces and stunning views.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Cleveland, exploring parks, gardens, and scenic natural spots. Discover the canyons and waterfalls of Starved Rock State Park, explore the sandy shores of Indiana Dunes National Park, and experience the natural beauty of Cuyahoga Valley National Park. Stroll through Holden Arboretum and conclude your journey at Lake View Cemetery in Cleveland. Get ready to immerse yourself in breathtaking outdoor beauty on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Au Cheval",
  //           time_spent: "2 hours",
  //           address: "800 W Randolph St, Chicago, IL 60607",
  //           description:
  //             "Begin your foodie adventure at Au Cheval in Chicago, known for its mouthwatering burgers, upscale diner ambiance, and an extensive craft beer selection.",
  //         },
  //         {
  //           stop_name: "Sokolowski's University Inn",
  //           time_spent: "1.5 hours",
  //           address: "1201 University Rd, Cleveland, OH 44113",
  //           description:
  //             "Treat yourself to Polish and Eastern European comfort food at Sokolowski's University Inn, a Cleveland institution since 1923.",
  //         },
  //         {
  //           stop_name: "West Side Market",
  //           time_spent: "2 hours",
  //           address: "1979 W 25th St, Cleveland, OH 44113",
  //           description:
  //             "Experience the vibrant West Side Market in Cleveland, offering a wide variety of fresh produce, meats, cheeses, and delectable international cuisines.",
  //         },
  //         {
  //           stop_name: "Mabel's BBQ",
  //           time_spent: "1.5 hours",
  //           address: "2050 E 4th St, Cleveland, OH 44115",
  //           description:
  //             "Indulge in mouthwatering BBQ at Mabel's BBQ, owned by celebrity chef Michael Symon, offering a delicious array of smoked meats and tasty sides.",
  //         },
  //         {
  //           stop_name: "Mitchell's Ice Cream",
  //           time_spent: "1 hour",
  //           address: "1867 W 25th St, Cleveland, OH 44113",
  //           description:
  //             "Conclude your foodie journey with a sweet treat at Mitchell's Ice Cream, a local favorite with a delightful selection of handmade ice creams and sorbets.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a mouthwatering foodie road trip from Chicago to Cleveland, savoring diverse cuisines and delicious treats at every stop. Enjoy mouthwatering burgers at Au Cheval in Chicago, indulge in Polish comfort food at Sokolowski's University Inn, and explore the vibrant West Side Market in Cleveland. Delight in BBQ at Mabel's BBQ, and conclude your journey with sweet treats at Mitchell's Ice Cream. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at the Art Institute of Chicago, one of the oldest and largest art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "Frank Lloyd Wright Home and Studio",
  //           time_spent: "2 hours",
  //           address: "951 Chicago Ave, Oak Park, IL 60302",
  //           description:
  //             "Explore the Frank Lloyd Wright Home and Studio in Oak Park, a preserved architectural gem showcasing the early works of the renowned architect.",
  //         },
  //         {
  //           stop_name: "Cleveland Museum of Art",
  //           time_spent: "3 hours",
  //           address: "11150 East Blvd, Cleveland, OH 44106",
  //           description:
  //             "Discover the art and culture of Cleveland at the Cleveland Museum of Art, featuring an impressive collection spanning 6,000 years of artistic achievements.",
  //         },
  //         {
  //           stop_name: "Rock and Roll Hall of Fame",
  //           time_spent: "2.5 hours",
  //           address: "1100 Rock and Roll Blvd, Cleveland, OH 44114",
  //           description:
  //             "Immerse yourself in the history of rock and roll at the Rock and Roll Hall of Fame in Cleveland, showcasing iconic memorabilia and music exhibits.",
  //         },
  //         {
  //           stop_name: "Playhouse Square",
  //           time_spent: "2 hours",
  //           address: "1501 Euclid Ave, Cleveland, OH 44115",
  //           description:
  //             "Conclude your cultural journey at Playhouse Square in Cleveland, the country's second-largest performing arts center, where you can catch a show or explore its historic theaters.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Cleveland, exploring arts, history, and diverse traditions. Visit the Art Institute of Chicago's world-class art collection, explore Frank Lloyd Wright's architectural works, and discover the art and culture of Cleveland at the Cleveland Museum of Art. Immerse yourself in the history of rock and roll at the Rock and Roll Hall of Fame, and conclude your journey at Playhouse Square, the country's second-largest performing arts center. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Cincinnati": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "International Museum of Surgical Science",
  //           time_spent: "2 hours",
  //           address: "1524 N Lake Shore Dr, Chicago, IL 60610",
  //           description:
  //             "Begin your eccentric road trip at the International Museum of Surgical Science in Chicago, a unique museum showcasing the history and art of surgery and medical instruments.",
  //         },
  //         {
  //           stop_name: "World's Largest Wind Chime",
  //           time_spent: "1 hour",
  //           address: "109 E Main St, Casey, IL 62420",
  //           description:
  //             "Experience the enchanting World's Largest Wind Chime in Casey, IL, an eccentric roadside attraction standing at 55 feet tall.",
  //         },
  //         {
  //           stop_name: "Bigfoot Research Headquarters",
  //           time_spent: "1.5 hours",
  //           address: "US-50, Crosstown, IN 47227",
  //           description:
  //             "Delve into the mysterious at the Bigfoot Research Headquarters in Crosstown, IN, a quirky destination dedicated to the legendary creature.",
  //         },
  //         {
  //           stop_name: "Mothman Museum",
  //           time_spent: "2 hours",
  //           address: "400 Main St, Point Pleasant, WV 25550",
  //           description:
  //             "Unravel the legend of Mothman at the Mothman Museum in Point Pleasant, WV, featuring exhibits and artifacts related to the mythical creature.",
  //         },
  //         {
  //           stop_name: "American Sign Museum",
  //           time_spent: "2 hours",
  //           address: "1330 Monmouth Ave, Cincinnati, OH 45225",
  //           description:
  //             "Conclude your eccentric journey at the American Sign Museum in Cincinnati, an enthralling museum dedicated to preserving and showcasing vintage signs and neon art.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Cincinnati, encountering quirky attractions and offbeat wonders along the way. Visit the International Museum of Surgical Science in Chicago, see the World's Largest Wind Chime in Casey, and explore the Bigfoot Research Headquarters in Crosstown. Unravel the legend of Mothman at the Mothman Museum in Point Pleasant, and conclude your journey at the American Sign Museum in Cincinnati. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Indiana Dunes National Park",
  //           time_spent: "1.5 days",
  //           address: "1100 N Mineral Springs Rd, Porter, IN 46304",
  //           description:
  //             "Start your nature retreat at Indiana Dunes National Park, where you can hike through sand dunes, relax on beautiful beaches, and enjoy stunning views of Lake Michigan.",
  //         },
  //         {
  //           stop_name: "Clifty Falls State Park",
  //           time_spent: "2 days",
  //           address: "1501 Green Rd, Madison, IN 47250",
  //           description:
  //             "Explore the scenic beauty of Clifty Falls State Park, featuring waterfalls, deep canyons, and rugged gorges, offering excellent hiking opportunities.",
  //         },
  //         {
  //           stop_name: "Great Smoky Mountains National Park",
  //           time_spent: "3 days",
  //           address: "107 Park Headquarters Rd, Gatlinburg, TN 37738",
  //           description:
  //             "Discover the breathtaking beauty of Great Smoky Mountains National Park, with its diverse wildlife, lush forests, and picturesque mountain vistas.",
  //         },
  //         {
  //           stop_name: "Hocking Hills State Park",
  //           time_spent: "2 days",
  //           address: "19852 OH-664, Logan, OH 43138",
  //           description:
  //             "Immerse yourself in the natural wonders of Hocking Hills State Park, featuring stunning rock formations, waterfalls, and scenic trails.",
  //         },
  //         {
  //           stop_name: "Cincinnati Zoo & Botanical Garden",
  //           time_spent: "1 day",
  //           address: "3400 Vine St, Cincinnati, OH 45220",
  //           description:
  //             "Conclude your nature-filled journey at the Cincinnati Zoo & Botanical Garden, where you can admire diverse plant life and learn about fascinating wildlife conservation efforts.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Cincinnati, exploring national parks, scenic trails, and picturesque gardens. Experience the beauty of Indiana Dunes National Park, hike through Clifty Falls State Park's waterfalls and canyons, and discover the breathtaking scenery of Great Smoky Mountains National Park. Immerse yourself in the natural wonders of Hocking Hills State Park and conclude your journey at Cincinnati Zoo & Botanical Garden, where you can admire diverse plant life and learn about wildlife conservation efforts. Get ready to rejuvenate your senses on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Lou Malnati's Pizzeria",
  //           time_spent: "2 hours",
  //           address: "805 S State St, Chicago, IL 60605",
  //           description:
  //             "Begin your foodie adventure at Lou Malnati's Pizzeria in Chicago, where you can savor the city's famous deep-dish pizza, a classic Chicago culinary delight.",
  //         },
  //         {
  //           stop_name: "Eli's BBQ",
  //           time_spent: "1.5 hours",
  //           address: "3313 Riverside Dr, Cincinnati, OH 45226",
  //           description:
  //             "Treat yourself to mouthwatering BBQ at Eli's BBQ in Cincinnati, known for its flavorful smoked meats and tasty sides.",
  //         },
  //         {
  //           stop_name: "Findlay Market",
  //           time_spent: "2 hours",
  //           address: "1801 Race St, Cincinnati, OH 45202",
  //           description:
  //             "Experience the vibrant Findlay Market in Cincinnati, offering a wide variety of fresh produce, meats, cheeses, and delectable international cuisines.",
  //         },
  //         {
  //           stop_name: "Skyline Chili",
  //           time_spent: "1.5 hours",
  //           address: "290 Ludlow Ave, Cincinnati, OH 45220",
  //           description:
  //             "Indulge in Cincinnati's iconic dish, Cincinnati-style chili, at Skyline Chili, where you can enjoy it served over spaghetti or hot dogs with a variety of toppings.",
  //         },
  //         {
  //           stop_name: "Graeter's Ice Cream",
  //           time_spent: "1 hour",
  //           address: "1401 Vine St, Cincinnati, OH 45202",
  //           description:
  //             "Conclude your foodie journey with a sweet treat at Graeter's Ice Cream, a Cincinnati institution known for its rich and creamy artisanal ice cream flavors.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a mouthwatering foodie road trip from Chicago to Cincinnati, savoring diverse cuisines and delicious treats at every stop. Enjoy Chicago's famous deep-dish pizza at Lou Malnati's Pizzeria, indulge in mouthwatering BBQ at Eli's BBQ, and explore the vibrant Findlay Market offering fresh produce and international cuisines. Delight in Cincinnati-style chili at Skyline Chili and conclude your journey with sweet treats at Graeter's Ice Cream. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at the Art Institute of Chicago, one of the oldest and largest art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "Frank Lloyd Wright Home and Studio",
  //           time_spent: "2 hours",
  //           address: "951 Chicago Ave, Oak Park, IL 60302",
  //           description:
  //             "Explore the Frank Lloyd Wright Home and Studio in Oak Park, a preserved architectural gem showcasing the early works of the renowned architect.",
  //         },
  //         {
  //           stop_name: "Cincinnati Art Museum",
  //           time_spent: "3 hours",
  //           address: "953 Eden Park Dr, Cincinnati, OH 45202",
  //           description:
  //             "Discover the art and culture of Cincinnati at the Cincinnati Art Museum, featuring an impressive collection of over 67,000 artworks spanning 6,000 years of history.",
  //         },
  //         {
  //           stop_name: "National Underground Railroad Freedom Center",
  //           time_spent: "2.5 hours",
  //           address: "50 E Freedom Way, Cincinnati, OH 45202",
  //           description:
  //             "Immerse yourself in the history of the Underground Railroad at the National Underground Railroad Freedom Center in Cincinnati, dedicated to promoting understanding of slavery and the struggle for freedom.",
  //         },
  //         {
  //           stop_name: "Over-the-Rhine Historic District",
  //           time_spent: "2 hours",
  //           address: "Over-the-Rhine, Cincinnati, OH 45202",
  //           description:
  //             "Conclude your cultural journey at the Over-the-Rhine Historic District in Cincinnati, a vibrant neighborhood known for its preserved 19th-century architecture and eclectic arts scene.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Cincinnati, exploring arts, history, and diverse traditions. Visit the Art Institute of Chicago's world-class art collection, explore Frank Lloyd Wright's architectural works, and discover the art and culture of Cincinnati at the Cincinnati Art Museum. Immerse yourself in the history of the Underground Railroad at the National Underground Railroad Freedom Center, and conclude your journey at the vibrant Over-the-Rhine Historic District. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Nashville": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "International Museum of Surgical Science",
  //           time_spent: "2 hours",
  //           address: "1524 N Lake Shore Dr, Chicago, IL 60610",
  //           description:
  //             "Begin your eccentric road trip at the International Museum of Surgical Science in Chicago, a unique museum showcasing the history and art of surgery and medical instruments.",
  //         },
  //         {
  //           stop_name: "Giant Ball of Twine",
  //           time_spent: "1 hour",
  //           address: "407 E Adams St, Sycamore, IL 60178",
  //           description:
  //             "Behold the quirky Giant Ball of Twine in Sycamore, IL, an eccentric roadside attraction with a massive ball of twine.",
  //         },
  //         {
  //           stop_name: "The Lost Sea Adventure",
  //           time_spent: "2.5 hours",
  //           address: "140 Lost Sea Rd, Sweetwater, TN 37874",
  //           description:
  //             "Explore the underground wonderland of The Lost Sea Adventure in Sweetwater, TN, featuring America's largest underground lake and guided cave tours.",
  //         },
  //         {
  //           stop_name: "Jack Daniel's Distillery",
  //           time_spent: "3 hours",
  //           address: "133 Lynchburg Hwy, Lynchburg, TN 37352",
  //           description:
  //             "Visit the legendary Jack Daniel's Distillery in Lynchburg, TN, to learn about the history and craftsmanship of this iconic Tennessee whiskey.",
  //         },
  //         {
  //           stop_name: "Parthenon - Centennial Park",
  //           time_spent: "2 hours",
  //           address: "2500 West End Ave, Nashville, TN 37203",
  //           description:
  //             "Conclude your eccentric journey at the Parthenon in Centennial Park, Nashville, a full-scale replica of the ancient Greek temple, complete with an art museum inside.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Nashville, encountering quirky attractions and offbeat wonders along the way. Visit the International Museum of Surgical Science in Chicago, behold the Giant Ball of Twine in Sycamore, and explore the underground wonderland of The Lost Sea Adventure in Sweetwater. Visit the Jack Daniel's Distillery in Lynchburg and conclude your journey at the Parthenon in Centennial Park, Nashville. Get ready for a weird and entertaining adventure through the Midwest and the South.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Starved Rock State Park",
  //           time_spent: "1.5 days",
  //           address: "2668 E 875th Rd, Oglesby, IL 61348",
  //           description:
  //             "Start your nature retreat at Starved Rock State Park, a picturesque park along the Illinois River with canyons, waterfalls, and hiking trails through lush forests.",
  //         },
  //         {
  //           stop_name: "Shawnee National Forest",
  //           time_spent: "2 days",
  //           address: "50 Hwy 145 S, Harrisburg, IL 62946",
  //           description:
  //             "Explore the beauty of Shawnee National Forest, offering stunning rock formations, scenic overlooks, and opportunities for hiking and nature appreciation.",
  //         },
  //         {
  //           stop_name: "Mammoth Cave National Park",
  //           time_spent: "3 days",
  //           address: "1 Mammoth Cave Pkwy, Mammoth Cave, KY 42259",
  //           description:
  //             "Discover the underground wonders of Mammoth Cave National Park, boasting the world's longest cave system with fascinating rock formations and unique wildlife.",
  //         },
  //         {
  //           stop_name: "Great Smoky Mountains National Park",
  //           time_spent: "3 days",
  //           address: "107 Park Headquarters Rd, Gatlinburg, TN 37738",
  //           description:
  //             "Immerse yourself in the breathtaking beauty of Great Smoky Mountains National Park, featuring diverse wildlife, lush forests, and picturesque mountain vistas.",
  //         },
  //         {
  //           stop_name: "Natchez Trace Parkway",
  //           time_spent: "2.5 days",
  //           address: "2680 Natchez Trace Pkwy, Tupelo, MS 38804",
  //           description:
  //             "Conclude your nature-filled journey with a scenic drive along the Natchez Trace Parkway, a historic and beautiful route with plenty of opportunities for hiking and enjoying nature.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Nashville, exploring national parks, serene trails, and picturesque scenery. Discover the canyons and waterfalls of Starved Rock State Park, explore the beauty of Shawnee National Forest, and experience the underground wonders of Mammoth Cave National Park. Immerse yourself in the breathtaking beauty of Great Smoky Mountains National Park and conclude your journey with a scenic drive along the Natchez Trace Parkway. Get ready to rejuvenate your senses on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Lou Malnati's Pizzeria",
  //           time_spent: "2 hours",
  //           address: "805 S State St, Chicago, IL 60605",
  //           description:
  //             "Begin your foodie adventure at Lou Malnati's Pizzeria in Chicago, where you can savor the city's famous deep-dish pizza, a classic Chicago culinary delight.",
  //         },
  //         {
  //           stop_name: "Red State BBQ",
  //           time_spent: "1.5 hours",
  //           address: "4020 Georgetown Rd, Lexington, KY 40511",
  //           description:
  //             "Indulge in authentic Kentucky barbecue at Red State BBQ in Lexington, known for its mouthwatering pulled pork, ribs, and brisket.",
  //         },
  //         {
  //           stop_name: "Monell's Dining & Catering",
  //           time_spent: "1.5 hours",
  //           address: "1235 6th Ave N, Nashville, TN 37208",
  //           description:
  //             "Experience Southern hospitality and family-style dining at Monell's in Nashville, serving up traditional Southern dishes like fried chicken, cornbread, and collard greens.",
  //         },
  //         {
  //           stop_name: "Peg Leg Porker",
  //           time_spent: "2 hours",
  //           address: "903 Gleaves St, Nashville, TN 37203",
  //           description:
  //             "Indulge in authentic Tennessee barbecue at Peg Leg Porker in Nashville, known for its smoky ribs, pulled pork, and signature dry rub.",
  //         },
  //         {
  //           stop_name: "Biscuit Love Gulch",
  //           time_spent: "1.5 hours",
  //           address: "316 11th Ave S, Nashville, TN 37203",
  //           description:
  //             "Treat yourself to fluffy, buttery biscuits and creative Southern breakfast dishes at Biscuit Love in Nashville's Gulch neighborhood.",
  //         },
  //         {
  //           stop_name: "Goo Goo Shop & Dessert Bar",
  //           time_spent: "1 hour",
  //           address: "116 3rd Ave S, Nashville, TN 37201",
  //           description:
  //             "Conclude your foodie journey with sweet treats at the Goo Goo Shop & Dessert Bar, where you can sample Nashville's iconic Goo Goo Cluster and indulge in decadent desserts.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a mouthwatering foodie road trip from Chicago to Nashville, savoring diverse cuisines and delicious treats at every stop. Enjoy Chicago's famous deep-dish pizza at Lou Malnati's Pizzeria, experience Southern hospitality and family-style dining at Monell's, and indulge in authentic Tennessee barbecue at Peg Leg Porker. Treat yourself to fluffy biscuits at Biscuit Love Gulch and conclude your journey with sweet treats at the Goo Goo Shop & Dessert Bar. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at the Art Institute of Chicago, one of the oldest and largest art museums in the United States. Explore an extensive collection of world-class art and exhibits.",
  //         },
  //         {
  //           stop_name: "Frank Lloyd Wright Home and Studio",
  //           time_spent: "2 hours",
  //           address: "951 Chicago Ave, Oak Park, IL 60302",
  //           description:
  //             "Explore the Frank Lloyd Wright Home and Studio in Oak Park, a preserved architectural gem showcasing the early works of the renowned architect.",
  //         },
  //         {
  //           stop_name: "Country Music Hall of Fame",
  //           time_spent: "3 hours",
  //           address: "222 5th Ave S, Nashville, TN 37203",
  //           description:
  //             "Discover the history and legacy of country music at the Country Music Hall of Fame in Nashville, featuring exhibits and artifacts from legendary musicians.",
  //         },
  //         {
  //           stop_name: "Ryman Auditorium",
  //           time_spent: "2 hours",
  //           address: "116 5th Ave N, Nashville, TN 37219",
  //           description:
  //             "Visit the iconic Ryman Auditorium, known as the Mother Church of Country Music, to explore the music venue's rich history and legendary performances.",
  //         },
  //         {
  //           stop_name: "Belle Meade Plantation",
  //           time_spent: "2.5 hours",
  //           address: "5025 Harding Pike, Nashville, TN 37205",
  //           description:
  //             "Conclude your cultural journey at Belle Meade Plantation, a historic site in Nashville that offers insights into the region's antebellum history and architecture.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Nashville, exploring arts, history, and diverse traditions. Visit the Art Institute of Chicago's world-class art collection, explore Frank Lloyd Wright's architectural works, and discover the history of country music at the Country Music Hall of Fame. Explore the iconic Ryman Auditorium and conclude your journey at Belle Meade Plantation, delving into the region's antebellum history. Get ready to delve into the rich cultural heritage of the Midwest and the South along this enriching road trip.",
  //     },
  //   },
  //   "Chicago-to-Kansas-City": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "International Museum of Surgical Science",
  //           time_spent: "2 hours",
  //           address: "1524 N Lake Shore Dr, Chicago, IL 60610",
  //           description:
  //             "Begin your eccentric road trip at the International Museum of Surgical Science in Chicago, a unique museum showcasing the history and art of surgery and medical instruments.",
  //         },
  //         {
  //           stop_name:
  //             "The World's Largest Collection of the World's Smallest Versions of the World's Largest Things",
  //           time_spent: "1.5 hours",
  //           address: "111 S Main St, Lucas, KS 67648",
  //           description:
  //             "Witness the delightful collection of miniatures at The World's Largest Collection of the World's Smallest Versions of the World's Largest Things in Lucas, KS.",
  //         },
  //         {
  //           stop_name: "Monument Rocks",
  //           time_spent: "2.5 hours",
  //           address: "Gove 16, Oakley, KS 67748",
  //           description:
  //             "Discover the geological wonders of Monument Rocks in Oakley, KS, featuring stunning chalk formations rising from the prairie.",
  //         },
  //         {
  //           stop_name: "Stroud's Oak Ridge Manor",
  //           time_spent: "2 hours",
  //           address: "5410 NE Oak Ridge Dr, Kansas City, MO 64119",
  //           description:
  //             "Indulge in classic comfort food at Stroud's Oak Ridge Manor in Kansas City, known for its famous pan-fried chicken and homestyle dishes.",
  //         },
  //         {
  //           stop_name:
  //             "The Money Museum at the Federal Reserve Bank of Kansas City",
  //           time_spent: "1.5 hours",
  //           address: "1 Memorial Dr, Kansas City, MO 64198",
  //           description:
  //             "Conclude your eccentric journey at The Money Museum, where you can explore the history of money, see millions of dollars, and learn about the Federal Reserve.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Chicago to Kansas City, encountering quirky attractions and offbeat wonders along the way. Visit the International Museum of Surgical Science in Chicago, witness a delightful collection of miniatures in Lucas, and discover the geological wonders of Monument Rocks. Indulge in classic comfort food at Stroud's Oak Ridge Manor in Kansas City and explore the history of money at The Money Museum. Get ready for a weird and entertaining adventure through the Midwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Starved Rock State Park",
  //           time_spent: "1.5 days",
  //           address: "2668 E 875th Rd, Oglesby, IL 61348",
  //           description:
  //             "Start your nature retreat at Starved Rock State Park, a picturesque park along the Illinois River with canyons, waterfalls, and hiking trails through lush forests.",
  //         },
  //         {
  //           stop_name: "Mark Twain Lake",
  //           time_spent: "2 days",
  //           address: "21689 MO-107, Monroe City, MO 63456",
  //           description:
  //             "Enjoy the tranquility of Mark Twain Lake, offering opportunities for boating, fishing, and relaxing by the water in a beautiful natural setting.",
  //         },
  //         {
  //           stop_name: "Hawn State Park",
  //           time_spent: "3 days",
  //           address: "12096 Park Dr, Ste. Genevieve, MO 63670",
  //           description:
  //             "Explore the natural beauty of Hawn State Park, featuring rugged terrain, clear streams, and miles of scenic hiking trails amidst oak and pine forests.",
  //         },
  //         {
  //           stop_name: "Lake of the Ozarks State Park",
  //           time_spent: "2.5 days",
  //           address: "403 MO-134, Kaiser, MO 65047",
  //           description:
  //             "Discover the recreational paradise of Lake of the Ozarks State Park, offering boating, fishing, hiking, and stunning lakefront views.",
  //         },
  //         {
  //           stop_name: "Loess Bluffs National Wildlife Refuge",
  //           time_spent: "2 days",
  //           address: "RR 1, Mound City, MO 64470",
  //           description:
  //             "Conclude your nature-filled journey at Loess Bluffs National Wildlife Refuge, a haven for birdwatchers and wildlife enthusiasts, with wetlands and grasslands teeming with diverse species.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a nature-filled road trip from Chicago to Kansas City, exploring national parks, tranquil lakes, and picturesque scenery. Discover the canyons and waterfalls of Starved Rock State Park, enjoy the tranquility of Mark Twain Lake, and explore the natural beauty of Hawn State Park. Experience the recreational paradise of Lake of the Ozarks State Park and conclude your journey at Loess Bluffs National Wildlife Refuge, teeming with diverse wildlife. Get ready to rejuvenate your senses on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Portillo's",
  //           time_spent: "2 hours",
  //           address: "520 W Taylor St, Chicago, IL 60607",
  //           description:
  //             "Start your foodie adventure at Portillo's in Chicago, a local favorite known for its classic Chicago-style hot dogs, Italian beef sandwiches, and chocolate cake shakes.",
  //         },
  //         {
  //           stop_name: "Joe's Kansas City Bar-B-Que",
  //           time_spent: "1.5 hours",
  //           address: "3002 W 47th Ave, Kansas City, KS 66103",
  //           description:
  //             "Savor authentic Kansas City barbecue at Joe's, an award-winning BBQ joint offering lip-smacking ribs, burnt ends, and pulled pork sandwiches.",
  //         },
  //         {
  //           stop_name: "Stroud's Oak Ridge Manor",
  //           time_spent: "2 hours",
  //           address: "5410 NE Oak Ridge Dr, Kansas City, MO 64119",
  //           description:
  //             "Indulge in classic comfort food at Stroud's Oak Ridge Manor in Kansas City, known for its famous pan-fried chicken and homestyle dishes.",
  //         },
  //         {
  //           stop_name: "Fiorella's Jack Stack Barbecue",
  //           time_spent: "2 hours",
  //           address: "13441 Holmes Rd, Kansas City, MO 64145",
  //           description:
  //             "Experience refined barbecue at Fiorella's Jack Stack, where you can enjoy succulent ribs, burnt ends, and flavorful sides in a stylish setting.",
  //         },
  //         {
  //           stop_name: "Christopher Elbow Artisanal Chocolate",
  //           time_spent: "1 hour",
  //           address: "1819 McGee St, Kansas City, MO 64108",
  //           description:
  //             "Conclude your foodie journey with artisanal chocolates at Christopher Elbow, known for unique flavor combinations and beautifully handcrafted chocolates.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a mouthwatering foodie road trip from Chicago to Kansas City, savoring diverse cuisines and delicious treats at every stop. Enjoy classic Chicago-style hot dogs at Portillo's, indulge in authentic Kansas City barbecue at Joe's Kansas City Bar-B-Que, and relish in classic comfort food at Stroud's Oak Ridge Manor. Experience refined barbecue at Fiorella's Jack Stack Barbecue and conclude your journey with artisanal chocolates at Christopher Elbow Artisanal Chocolate. Get ready for a savory and gastronomic adventure along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "The Art Institute of Chicago",
  //           time_spent: "3 hours",
  //           address: "111 S Michigan Ave, Chicago, IL 60603",
  //           description:
  //             "Begin your cultural journey at The Art Institute of Chicago, one of the oldest and largest art museums in the United States, housing a diverse collection of artworks from different cultures and time periods.",
  //         },
  //         {
  //           stop_name: "Gateway Arch National Park",
  //           time_spent: "2.5 hours",
  //           address: "11 N 4th St, St. Louis, MO 63102",
  //           description:
  //             "Take a detour to Gateway Arch National Park in St. Louis, where you can explore the iconic Gateway Arch and learn about the historical significance of westward expansion.",
  //         },
  //         {
  //           stop_name: "Nelson-Atkins Museum of Art",
  //           time_spent: "3 hours",
  //           address: "4525 Oak St, Kansas City, MO 64111",
  //           description:
  //             "Discover the impressive Nelson-Atkins Museum of Art in Kansas City, known for its extensive collection of European, Asian, and American art, as well as beautiful sculpture gardens.",
  //         },
  //         {
  //           stop_name: "Negro Leagues Baseball Museum",
  //           time_spent: "2 hours",
  //           address: "1616 E 18th St, Kansas City, MO 64108",
  //           description:
  //             "Explore the rich history of African American baseball at the Negro Leagues Baseball Museum in Kansas City, celebrating the legacy of legendary players and their contributions to the sport.",
  //         },
  //         {
  //           stop_name: "Kansas City Crossroads Arts District",
  //           time_spent: "2.5 hours",
  //           address: "Kansas City Crossroads Arts District, Kansas City, MO",
  //           description:
  //             "Conclude your cultural journey at the Kansas City Crossroads Arts District, a vibrant neighborhood filled with art galleries, studios, and eclectic shops, showcasing the city's contemporary arts scene.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Chicago to Kansas City, exploring arts, history, and diverse traditions. Visit The Art Institute of Chicago's extensive art collection, take a detour to the iconic Gateway Arch National Park in St. Louis, and discover the impressive Nelson-Atkins Museum of Art in Kansas City. Explore the history of African American baseball at the Negro Leagues Baseball Museum and conclude your journey at the vibrant Kansas City Crossroads Arts District. Get ready to delve into the rich cultural heritage of the Midwest along this enriching road trip.",
  //     },
  //   },
  //   "Seattle-to-Portland": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "Fremont Troll",
  //           time_spent: "1 hour",
  //           address: "N 36th St &, Troll Ave N, Seattle, WA 98103",
  //           description:
  //             "Start your eccentric road trip at the Fremont Troll, an iconic public sculpture located under the Aurora Bridge, with a quirky and artistic touch.",
  //         },
  //         {
  //           stop_name: "World's Largest Frying Pan",
  //           time_spent: "1.5 hours",
  //           address: "511 E Mill Plain Blvd, Vancouver, WA 98663",
  //           description:
  //             "Behold the World's Largest Frying Pan in Vancouver, WA, a kitschy roadside attraction that will leave you amused and fascinated.",
  //         },
  //         {
  //           stop_name: "Mill Ends Park",
  //           time_spent: "1 hour",
  //           address: "SW Naito Pkwy, Portland, OR 97204",
  //           description:
  //             "Visit Mill Ends Park in Portland, officially the world's smallest park, showcasing its peculiar charm in the heart of the city.",
  //         },
  //         {
  //           stop_name: "Voodoo Doughnut",
  //           time_spent: "1.5 hours",
  //           address: "22 SW 3rd Ave, Portland, OR 97204",
  //           description:
  //             "Indulge in weird and quirky doughnuts at Voodoo Doughnut in Portland, where unconventional flavors and creative designs are a norm.",
  //         },
  //         {
  //           stop_name: "Lan Su Chinese Garden",
  //           time_spent: "2 hours",
  //           address: "239 NW Everett St, Portland, OR 97209",
  //           description:
  //             "Conclude your eccentric journey at the Lan Su Chinese Garden in Portland, a serene and authentic Chinese garden hidden in the city's bustling streets.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Seattle to Portland, encountering quirky attractions and offbeat wonders along the way. Visit the iconic Fremont Troll in Seattle, behold the World's Largest Frying Pan in Vancouver, and explore the world's smallest park at Mill Ends Park in Portland. Indulge in weird and quirky doughnuts at Voodoo Doughnut and conclude your journey at the serene Lan Su Chinese Garden. Get ready for a weird and entertaining adventure through the Pacific Northwest.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Mount Rainier National Park",
  //           time_spent: "1.5 days",
  //           address: "39000 State Route 706 E, Ashford, WA 98304",
  //           description:
  //             "Start your nature retreat at Mount Rainier National Park, where you can hike amidst the majestic beauty of the iconic Mount Rainier and witness stunning alpine meadows and glaciers.",
  //         },
  //         {
  //           stop_name: "Mount St. Helens National Volcanic Monument",
  //           time_spent: "2 days",
  //           address: "42218 NE Yale Bridge Rd, Amboy, WA 98601",
  //           description:
  //             "Explore the volcanic wonders of Mount St. Helens National Volcanic Monument, known for its striking landscapes, lava formations, and the awe-inspiring crater.",
  //         },
  //         {
  //           stop_name: "Columbia River Gorge National Scenic Area",
  //           time_spent: "2.5 days",
  //           address: "902 Wasco Ave, Hood River, OR 97031",
  //           description:
  //             "Discover the beauty of the Columbia River Gorge, offering breathtaking vistas, stunning waterfalls like Multnomah Falls, and ample opportunities for outdoor activities.",
  //         },
  //         {
  //           stop_name: "Silver Falls State Park",
  //           time_spent: "2 days",
  //           address: "20024 Silver Falls Hwy SE, Sublimity, OR 97385",
  //           description:
  //             "Hike the Trail of Ten Falls in Silver Falls State Park, where you can witness multiple stunning waterfalls cascading amidst the lush forested surroundings.",
  //         },
  //         {
  //           stop_name: "Forest Park",
  //           time_spent: "1 day",
  //           address: "Forest Park, Portland, OR 97210",
  //           description:
  //             "Conclude your nature-filled journey at Forest Park in Portland, one of the largest urban forests in the United States, offering peaceful hiking trails and a diverse range of flora and fauna.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a scenic nature road trip from Seattle to Portland, exploring national parks, serene lakes, and picturesque views along the way. Hike amidst the beauty of Mount Rainier National Park, explore the volcanic wonders of Mount St. Helens National Volcanic Monument, and discover the breathtaking vistas of Columbia River Gorge. Witness stunning waterfalls in Silver Falls State Park and conclude your journey in the peaceful serenity of Forest Park. Get ready to rejuvenate your senses on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Pike Place Market",
  //           time_spent: "2 hours",
  //           address: "85 Pike St, Seattle, WA 98101",
  //           description:
  //             "Start your foodie adventure at Pike Place Market in Seattle, where you can sample fresh seafood, artisanal foods, and the world-famous Pike Place Chowder.",
  //         },
  //         {
  //           stop_name: "Cafe Broder",
  //           time_spent: "1.5 hours",
  //           address: "2508 SE Clinton St, Portland, OR 97202",
  //           description:
  //             "Enjoy a Scandinavian-inspired brunch at Cafe Broder in Portland, known for its mouthwatering dishes like Swedish pancakes and Norwegian eggs Benedict.",
  //         },
  //         {
  //           stop_name: "Voodoo Doughnut",
  //           time_spent: "1 hour",
  //           address: "22 SW 3rd Ave, Portland, OR 97204",
  //           description:
  //             "Indulge in weird and quirky doughnuts at Voodoo Doughnut in Portland, where unconventional flavors and creative designs are a norm.",
  //         },
  //         {
  //           stop_name: "Pok Pok",
  //           time_spent: "2 hours",
  //           address: "3226 SE Division St, Portland, OR 97202",
  //           description:
  //             "Experience authentic Thai street food at Pok Pok in Portland, offering a range of flavorful dishes like their famous chicken wings and papaya salad.",
  //         },
  //         {
  //           stop_name: "Salt & Straw",
  //           time_spent: "1 hour",
  //           address: "Multiple locations in Portland",
  //           description:
  //             "Conclude your foodie journey with unique and artisanal ice cream flavors at Salt & Straw, a beloved ice cream shop in Portland.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Seattle to Portland, indulging in diverse cuisines and savory treats at every stop. Sample fresh seafood and artisanal foods at Pike Place Market, enjoy Scandinavian-inspired brunch at Cafe Broder, and indulge in quirky doughnuts at Voodoo Doughnut. Experience authentic Thai street food at Pok Pok and conclude your journey with artisanal ice cream at Salt & Straw. Get ready for a savory and delightful culinary journey along the way.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Seattle Art Museum",
  //           time_spent: "2.5 hours",
  //           address: "1300 1st Ave, Seattle, WA 98101",
  //           description:
  //             "Start your cultural journey at the Seattle Art Museum, a renowned museum showcasing a diverse collection of art from around the world, including contemporary and indigenous artworks.",
  //         },
  //         {
  //           stop_name: "Museum of Glass",
  //           time_spent: "2 hours",
  //           address: "1801 Dock St, Tacoma, WA 98402",
  //           description:
  //             "Explore the Museum of Glass in Tacoma, where you can witness stunning glass artworks and even watch live glassblowing demonstrations.",
  //         },
  //         {
  //           stop_name: "Powell's City of Books",
  //           time_spent: "2.5 hours",
  //           address: "1005 W Burnside St, Portland, OR 97209",
  //           description:
  //             "Visit Powell's City of Books in Portland, the largest independent bookstore in the world, offering a vast collection of new and used books across multiple floors.",
  //         },
  //         {
  //           stop_name: "Portland Japanese Garden",
  //           time_spent: "2 hours",
  //           address: "611 SW Kingston Ave, Portland, OR 97205",
  //           description:
  //             "Experience tranquility at the Portland Japanese Garden, featuring authentic Japanese landscaping, tea houses, and cultural events.",
  //         },
  //         {
  //           stop_name: "Oregon Museum of Science and Industry",
  //           time_spent: "3 hours",
  //           address: "1945 SE Water Ave, Portland, OR 97214",
  //           description:
  //             "Conclude your cultural journey at the Oregon Museum of Science and Industry, an interactive museum offering exhibits on science, technology, and the environment.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Seattle to Portland, exploring arts, history, and diverse traditions. Visit the Seattle Art Museum's diverse art collection, witness stunning glass artworks at the Museum of Glass, and immerse yourself in the literary wonder of Powell's City of Books. Experience tranquility at the Portland Japanese Garden and explore science and technology at the Oregon Museum of Science and Industry. Get ready to delve into the rich cultural heritage of the Pacific Northwest along this enriching road trip.",
  //     },
  //   },
  //   "Seattle-to-San-Francisco": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "Fremont Troll",
  //           time_spent: "1 hour",
  //           address: "N 36th St &, Troll Ave N, Seattle, WA 98103",
  //           description:
  //             "Start your eccentric road trip at the Fremont Troll, an iconic public sculpture located under the Aurora Bridge, with a quirky and artistic touch.",
  //         },
  //         {
  //           stop_name: "Trees of Mystery",
  //           time_spent: "2 hours",
  //           address: "15500 US-101, Klamath, CA 95548",
  //           description:
  //             "Encounter the mysterious and peculiar Trees of Mystery in Klamath, CA, home to the unique Redwood Forest and Paul Bunyan and Babe statues.",
  //         },
  //         {
  //           stop_name: "Winchester Mystery House",
  //           time_spent: "2.5 hours",
  //           address: "525 S Winchester Blvd, San Jose, CA 95128",
  //           description:
  //             "Explore the enigmatic and eccentric Winchester Mystery House, known for its maze-like architecture and intriguing history.",
  //         },
  //         {
  //           stop_name: "Museum of Jurassic Technology",
  //           time_spent: "2 hours",
  //           address: "9341 Venice Blvd, Culver City, CA 90232",
  //           description:
  //             "Visit the Museum of Jurassic Technology, a peculiar and fascinating museum that blurs the line between fact and fiction, showcasing unusual artifacts and curiosities.",
  //         },
  //         {
  //           stop_name: "Wave Organ",
  //           time_spent: "1 hour",
  //           address: "83 Marina Green Dr, San Francisco, CA 94123",
  //           description:
  //             "Conclude your eccentric journey at the Wave Organ in San Francisco, an intriguing acoustic sculpture that produces sounds from the movements of the ocean.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Seattle to San Francisco, encountering quirky attractions and offbeat wonders along the way. Visit the iconic Fremont Troll in Seattle, encounter the mysterious Trees of Mystery in Klamath, and explore the enigmatic Winchester Mystery House in San Jose. Discover the peculiarities of the Museum of Jurassic Technology and conclude your journey with the acoustic marvel of the Wave Organ in San Francisco. Get ready for a weird and entertaining adventure along the West Coast.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Olympic National Park",
  //           time_spent: "2 days",
  //           address: "Olympic National Park, Washington, USA",
  //           description:
  //             "Start your nature retreat at Olympic National Park, where you can hike through old-growth forests, visit stunning waterfalls, and enjoy views of the rugged coastline.",
  //         },
  //         {
  //           stop_name: "Redwood National and State Parks",
  //           time_spent: "2.5 days",
  //           address: "1111 Second Street, Crescent City, CA 95531",
  //           description:
  //             "Explore the majestic Redwood National and State Parks, home to the tallest trees on Earth and a diverse range of wildlife.",
  //         },
  //         {
  //           stop_name: "Crater Lake National Park",
  //           time_spent: "2.5 days",
  //           address: "Crater Lake National Park, Oregon, USA",
  //           description:
  //             "Witness the stunning beauty of Crater Lake, the deepest lake in the United States, nestled in the caldera of an ancient volcano.",
  //         },
  //         {
  //           stop_name: "Avenue of the Giants",
  //           time_spent: "1.5 days",
  //           address: "Avenue of the Giants, California, USA",
  //           description:
  //             "Drive along the scenic Avenue of the Giants, a 31-mile stretch of old Highway 101, surrounded by towering ancient redwood trees.",
  //         },
  //         {
  //           stop_name: "Point Reyes National Seashore",
  //           time_spent: "2 days",
  //           address: "Point Reyes National Seashore, California, USA",
  //           description:
  //             "Conclude your nature-filled journey at Point Reyes National Seashore, offering stunning coastal views, wildlife sightings, and beautiful beaches.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a scenic nature road trip from Seattle to San Francisco, exploring rugged coastlines, lush forests, and picturesque views. Hike through old-growth forests at Olympic National Park, marvel at the majestic Redwood National and State Parks, and witness the stunning beauty of Crater Lake. Drive along the Avenue of the Giants, surrounded by towering redwood trees, and conclude your journey at Point Reyes National Seashore, offering stunning coastal views and beautiful beaches. Get ready to rejuvenate your senses on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Pike Place Market",
  //           time_spent: "2 hours",
  //           address: "85 Pike St, Seattle, WA 98101",
  //           description:
  //             "Start your foodie adventure at Pike Place Market in Seattle, where you can sample fresh seafood, artisanal foods, and the world-famous Pike Place Chowder.",
  //         },
  //         {
  //           stop_name: "Bouchon Bakery",
  //           time_spent: "1.5 hours",
  //           address: "6528 Yount St, Yountville, CA 94599",
  //           description:
  //             "Indulge in delectable pastries and desserts at Bouchon Bakery in Yountville, a delightful French bakery by Chef Thomas Keller.",
  //         },
  //         {
  //           stop_name: "Mission District, San Francisco",
  //           time_spent: "3 hours",
  //           address: "Mission District, San Francisco, CA",
  //           description:
  //             "Explore the culinary delights of San Francisco's Mission District, known for its diverse eateries, ranging from trendy cafes to taquerias.",
  //         },
  //         {
  //           stop_name: "Napa Valley Wineries",
  //           time_spent: "1.5 days",
  //           address: "Napa Valley, California, USA",
  //           description:
  //             "Experience wine and food pairing at the renowned wineries of Napa Valley, where you can savor exquisite wine and gourmet dishes.",
  //         },
  //         {
  //           stop_name: "Ferry Building Marketplace",
  //           time_spent: "2 hours",
  //           address: "1 Ferry Building, San Francisco, CA 94111",
  //           description:
  //             "Conclude your foodie journey at the Ferry Building Marketplace in San Francisco, offering a variety of artisanal foods and gourmet treats.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a mouthwatering foodie road trip from Seattle to San Francisco, savoring diverse cuisines and delicious treats at every stop. Sample fresh seafood and artisanal foods at Pike Place Market, indulge in delectable pastries at Bouchon Bakery, and explore the culinary delights of San Francisco's Mission District. Experience wine and food pairing at Napa Valley wineries and conclude your journey with gourmet treats at the Ferry Building Marketplace. Get ready for a savory and delightful culinary journey along the West Coast.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Seattle Art Museum",
  //           time_spent: "2.5 hours",
  //           address: "1300 1st Ave, Seattle, WA 98101",
  //           description:
  //             "Start your cultural journey at the Seattle Art Museum, a renowned museum showcasing a diverse collection of art from around the world, including contemporary and indigenous artworks.",
  //         },
  //         {
  //           stop_name: "Portland Japanese Garden",
  //           time_spent: "2.5 hours",
  //           address: "611 SW Kingston Ave, Portland, OR 97205",
  //           description:
  //             "Experience tranquility at the Portland Japanese Garden, featuring authentic Japanese landscaping, tea houses, and cultural events.",
  //         },
  //         {
  //           stop_name: "Columbia River Maritime Museum",
  //           time_spent: "2 hours",
  //           address: "1792 Marine Dr, Astoria, OR 97103",
  //           description:
  //             "Explore the maritime heritage of the Pacific Northwest at the Columbia River Maritime Museum in Astoria, featuring exhibits on maritime history and regional culture.",
  //         },
  //         {
  //           stop_name: "Asian Art Museum",
  //           time_spent: "3 hours",
  //           address: "200 Larkin St, San Francisco, CA 94102",
  //           description:
  //             "Visit the Asian Art Museum in San Francisco, one of the largest museums in the Western world devoted exclusively to Asian art and culture.",
  //         },
  //         {
  //           stop_name: "Chinatown, San Francisco",
  //           time_spent: "2.5 hours",
  //           address: "Chinatown, San Francisco, CA",
  //           description:
  //             "Conclude your cultural journey at San Francisco's Chinatown, the oldest and one of the largest Chinatowns outside of Asia, offering a glimpse into Chinese culture, history, and traditions.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Seattle to San Francisco, exploring arts, history, and diverse traditions. Visit the Seattle Art Museum's diverse art collection, experience tranquility at the Portland Japanese Garden, and explore maritime heritage at the Columbia River Maritime Museum. Discover Asian art and culture at the Asian Art Museum in San Francisco and conclude your journey in the vibrant Chinatown, offering a glimpse into Chinese culture and history. Get ready to delve into the rich cultural heritage of the West Coast along this enriching road trip.",
  //     },
  //   },
  //   "Memphis-to-Nashville": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "Sun Studio",
  //           time_spent: "1.5 hours",
  //           address: "706 Union Ave, Memphis, TN 38103",
  //           description:
  //             "Start your eccentric road trip at Sun Studio, the birthplace of rock 'n' roll, where legends like Elvis Presley and Johnny Cash recorded their hits.",
  //         },
  //         {
  //           stop_name: "International Rock-A-Billy Hall of Fame",
  //           time_spent: "1 hour",
  //           address: "105 N Church St, Jackson, TN 38301",
  //           description:
  //             "Explore the International Rock-A-Billy Hall of Fame in Jackson, TN, celebrating the pioneers of rockabilly music and preserving its unique history.",
  //         },
  //         {
  //           stop_name: "The Parthenon",
  //           time_spent: "2 hours",
  //           address: "2500 West End Ave, Nashville, TN 37203",
  //           description:
  //             "Visit The Parthenon in Nashville, a full-scale replica of the ancient Greek temple, housing an art gallery and a 42-foot statue of Athena.",
  //         },
  //         {
  //           stop_name: "Hatch Show Print",
  //           time_spent: "1.5 hours",
  //           address: "224 5th Ave S, Nashville, TN 37203",
  //           description:
  //             "Discover the historic Hatch Show Print in Nashville, a legendary letterpress shop known for creating iconic posters for musicians and events.",
  //         },
  //         {
  //           stop_name: "Lane Motor Museum",
  //           time_spent: "2 hours",
  //           address: "702 Murfreesboro Pike, Nashville, TN 37210",
  //           description:
  //             "Conclude your eccentric journey at Lane Motor Museum in Nashville, housing a collection of peculiar and unique automobiles from around the world.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Memphis to Nashville, encountering quirky attractions and offbeat wonders along the way. Visit the birthplace of rock 'n' roll at Sun Studio in Memphis and explore the International Rock-A-Billy Hall of Fame in Jackson. Discover The Parthenon and its 42-foot statue of Athena in Nashville, visit the legendary Hatch Show Print, and conclude your journey at Lane Motor Museum, housing unique automobiles. Get ready for a weird and entertaining adventure through Tennessee.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Shelby Farms Park",
  //           time_spent: "2 hours",
  //           address: "6903 Great View Dr N, Memphis, TN 38134",
  //           description:
  //             "Start your nature retreat at Shelby Farms Park, one of the largest urban parks in the United States, offering trails, lakes, and outdoor recreational activities.",
  //         },
  //         {
  //           stop_name: "Natchez Trace Parkway",
  //           time_spent: "1.5 days",
  //           address: "Natchez Trace Pkwy, TN, MS, AL",
  //           description:
  //             "Drive along the scenic Natchez Trace Parkway, a historic route featuring beautiful landscapes, hiking trails, and historic sites.",
  //         },
  //         {
  //           stop_name: "Cummins Falls State Park",
  //           time_spent: "2 days",
  //           address: "390 Cummins Falls Ln, Cookeville, TN 38501",
  //           description:
  //             "Explore Cummins Falls State Park, known for its stunning waterfalls and opportunities for hiking, swimming, and picnicking.",
  //         },
  //         {
  //           stop_name: "Burgess Falls State Park",
  //           time_spent: "2 hours",
  //           address: "4000 Burgess Falls Dr, Sparta, TN 38583",
  //           description:
  //             "Visit Burgess Falls State Park, offering scenic overlooks and a series of waterfalls along the Falling Water River.",
  //         },
  //         {
  //           stop_name: "Radnor Lake State Park",
  //           time_spent: "2 hours",
  //           address: "1160 Otter Creek Rd, Nashville, TN 37220",
  //           description:
  //             "Conclude your nature-filled journey at Radnor Lake State Park, a serene oasis in Nashville, perfect for hiking and birdwatching.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a scenic nature road trip from Memphis to Nashville, exploring serene rivers, lush forests, and picturesque views. Enjoy outdoor activities at Shelby Farms Park, drive along the historic Natchez Trace Parkway, and explore the stunning waterfalls of Cummins Falls State Park. Visit Burgess Falls State Park and witness a series of waterfalls and conclude your journey at the tranquil Radnor Lake State Park. Get ready to rejuvenate your senses on this refreshing nature retreat.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Gus's World Famous Fried Chicken",
  //           time_spent: "1.5 hours",
  //           address: "310 S Front St, Memphis, TN 38103",
  //           description:
  //             "Start your foodie adventure with a taste of the best at Gus's World Famous Fried Chicken in Memphis, where you can savor crispy and flavorful fried chicken.",
  //         },
  //         {
  //           stop_name: "Loveless Cafe",
  //           time_spent: "2 hours",
  //           address: "8400 TN-100, Nashville, TN 37221",
  //           description:
  //             "Indulge in classic Southern comfort food at Loveless Cafe in Nashville, renowned for their biscuits, fried chicken, and country ham.",
  //         },
  //         {
  //           stop_name: "Prince's Hot Chicken Shack",
  //           time_spent: "1.5 hours",
  //           address: "123 Ewing Dr, Nashville, TN 37207",
  //           description:
  //             "Experience the fiery Nashville hot chicken at Prince's Hot Chicken Shack, a local favorite known for its bold and spicy flavors.",
  //         },
  //         {
  //           stop_name: "Hattie B's Hot Chicken",
  //           time_spent: "2 hours",
  //           address: "112 19th Ave S, Nashville, TN 37203",
  //           description:
  //             "Try another Nashville hot chicken hotspot at Hattie B's, where you can customize the heat level and enjoy delicious sides.",
  //         },
  //         {
  //           stop_name: "Biscuit Love",
  //           time_spent: "1.5 hours",
  //           address: "316 11th Ave S, Nashville, TN 37203",
  //           description:
  //             "Conclude your foodie journey with gourmet biscuit sandwiches and Southern brunch favorites at Biscuit Love in Nashville.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a mouthwatering foodie road trip from Memphis to Nashville, savoring Southern cuisines and local delights at every stop. Enjoy the best fried chicken at Gus's World Famous Fried Chicken in Memphis, indulge in classic Southern comfort food at Loveless Cafe, and experience fiery Nashville hot chicken at Prince's Hot Chicken Shack and Hattie B's. Conclude your journey with gourmet biscuit sandwiches at Biscuit Love. Get ready for a savory and delightful culinary journey through Tennessee.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Graceland",
  //           time_spent: "3 hours",
  //           address: "3764 Elvis Presley Blvd, Memphis, TN 38116",
  //           description:
  //             "Start your cultural journey at Graceland, the iconic home of Elvis Presley, where you can explore the King of Rock 'n' Roll's life and music.",
  //         },
  //         {
  //           stop_name: "Stax Museum of American Soul Music",
  //           time_spent: "2 hours",
  //           address: "926 E McLemore Ave, Memphis, TN 38126",
  //           description:
  //             "Immerse yourself in the history of soul music at the Stax Museum, which celebrates the legacy of Stax Records and its impact on American music.",
  //         },
  //         {
  //           stop_name: "Country Music Hall of Fame and Museum",
  //           time_spent: "3 hours",
  //           address: "222 5th Ave S, Nashville, TN 37203",
  //           description:
  //             "Visit the Country Music Hall of Fame in Nashville, showcasing the rich history and evolution of country music through exhibits and memorabilia.",
  //         },
  //         {
  //           stop_name: "Ryman Auditorium",
  //           time_spent: "2 hours",
  //           address: "116 5th Ave N, Nashville, TN 37219",
  //           description:
  //             "Experience the Ryman Auditorium, known as the Mother Church of Country Music, where legends like Johnny Cash and Patsy Cline performed.",
  //         },
  //         {
  //           stop_name: "Broadway, Nashville",
  //           time_spent: "2.5 hours",
  //           address: "Broadway, Nashville, TN",
  //           description:
  //             "Conclude your cultural journey on Broadway in Nashville, a lively street filled with honky-tonks, live music, and the heart of Music City's nightlife.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Memphis to Nashville, exploring arts, history, and music. Visit Graceland, the iconic home of Elvis Presley, and immerse yourself in the history of soul music at the Stax Museum. Discover the rich history of country music at the Country Music Hall of Fame, experience the legendary Ryman Auditorium, and conclude your journey on Broadway in Nashville, the heart of Music City's nightlife. Get ready to delve into the soulful and vibrant cultural heritage of Tennessee along this enriching road trip.",
  //     },
  //   },
  //   "Memphis-to-Atlanta": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "The Peabody Memphis",
  //           time_spent: "1.5 hours",
  //           address: "149 Union Ave, Memphis, TN 38103",
  //           description:
  //             "Start your eccentric road trip at The Peabody Memphis, known for the daily parade of ducks from the rooftop to the lobby fountain.",
  //         },
  //         {
  //           stop_name: "World's Largest Peanut",
  //           time_spent: "30 minutes",
  //           address: "347 US-431, Eufaula, AL 36027",
  //           description:
  //             "Encounter the World's Largest Peanut in Eufaula, AL, an eccentric roadside attraction that will surely catch your attention.",
  //         },
  //         {
  //           stop_name: "Dinosaur World",
  //           time_spent: "2 hours",
  //           address: "1675 N Peachtree Pkwy, Calhoun, GA 30701",
  //           description:
  //             "Explore Dinosaur World in Calhoun, GA, an unusual theme park featuring life-size dinosaur replicas and a fossil dig.",
  //         },
  //         {
  //           stop_name: "Babyland General Hospital",
  //           time_spent: "1.5 hours",
  //           address: "300 NOK Dr, Cleveland, GA 30528",
  //           description:
  //             "Visit Babyland General Hospital, a peculiar attraction in Cleveland, GA, where Cabbage Patch Kids are 'born' and adopted.",
  //         },
  //         {
  //           stop_name: "The Waffle House Museum",
  //           time_spent: "1 hour",
  //           address: "2719 E College Ave, Decatur, GA 30030",
  //           description:
  //             "Conclude your eccentric journey at The Waffle House Museum in Decatur, GA, celebrating the history of the beloved Southern chain.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Memphis to Atlanta, encountering quirky attractions and offbeat wonders along the way. Witness the daily parade of ducks at The Peabody Memphis, encounter the World's Largest Peanut in Eufaula, AL, and explore life-size dinosaur replicas at Dinosaur World in Calhoun, GA. Visit Babyland General Hospital, where Cabbage Patch Kids are 'born' and adopted, and conclude your journey at The Waffle House Museum, celebrating the history of the Southern chain. Get ready for a weird and entertaining adventure through the South.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Great Smoky Mountains National Park",
  //           time_spent: "2 days",
  //           address: "107 Park Headquarters Rd, Gatlinburg, TN 37738",
  //           description:
  //             "Start your nature retreat at the Great Smoky Mountains National Park, a UNESCO World Heritage Site, with hiking trails, waterfalls, and stunning vistas.",
  //         },
  //         {
  //           stop_name: "Chattahoochee-Oconee National Forest",
  //           time_spent: "2 days",
  //           address: "1755 Cleveland Hwy, Gainesville, GA 30501",
  //           description:
  //             "Explore the Chattahoochee-Oconee National Forest, offering scenic beauty, hiking opportunities, and serene lakes and rivers.",
  //         },
  //         {
  //           stop_name: "Providence Canyon State Park",
  //           time_spent: "2 hours",
  //           address: "8930 Canyon Rd, Lumpkin, GA 31815",
  //           description:
  //             "Visit Providence Canyon State Park, often referred to as Georgia's 'Little Grand Canyon,' showcasing colorful canyons and unique geological formations.",
  //         },
  //         {
  //           stop_name: "Kennesaw Mountain National Battlefield Park",
  //           time_spent: "3 hours",
  //           address: "900 Kennesaw Mountain Dr, Kennesaw, GA 30152",
  //           description:
  //             "Learn about Civil War history and enjoy hiking trails and scenic overlooks at Kennesaw Mountain National Battlefield Park.",
  //         },
  //         {
  //           stop_name: "Arabia Mountain National Heritage Area",
  //           time_spent: "2 hours",
  //           address: "3350 Klondike Rd, Lithonia, GA 30038",
  //           description:
  //             "Conclude your nature-filled journey at Arabia Mountain National Heritage Area, featuring unique rock outcrops, rare plant species, and beautiful landscapes.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a scenic nature road trip from Memphis to Atlanta, exploring serene rivers, lush forests, and picturesque views. Discover the beauty of Great Smoky Mountains National Park, Chattahoochee-Oconee National Forest, and Providence Canyon State Park. Learn about Civil War history at Kennesaw Mountain National Battlefield Park and explore the unique rock outcrops at Arabia Mountain National Heritage Area. Get ready to rejuvenate your senses on this refreshing nature retreat through the South.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Central BBQ",
  //           time_spent: "1.5 hours",
  //           address: "147 E Butler Ave, Memphis, TN 38103",
  //           description:
  //             "Start your foodie adventure with some Memphis-style BBQ at Central BBQ, known for its delicious ribs, pulled pork, and tangy sauces.",
  //         },
  //         {
  //           stop_name: "City Cafe Diner",
  //           time_spent: "1.5 hours",
  //           address: "4991 Memorial Dr, Stone Mountain, GA 30083",
  //           description:
  //             "Indulge in Southern comfort food at City Cafe Diner in Stone Mountain, GA, offering classic dishes like fried chicken, collard greens, and cornbread.",
  //         },
  //         {
  //           stop_name: "Ponce City Market",
  //           time_spent: "2.5 hours",
  //           address: "675 Ponce De Leon Ave NE, Atlanta, GA 30308",
  //           description:
  //             "Explore the vibrant Ponce City Market in Atlanta, a food hall with various eateries offering diverse cuisines, from Southern to international dishes.",
  //         },
  //         {
  //           stop_name: "The Varsity",
  //           time_spent: "1.5 hours",
  //           address: "61 North Ave NW, Atlanta, GA 30308",
  //           description:
  //             "Try a classic Atlanta institution at The Varsity, serving hot dogs, burgers, and onion rings, and known for its iconic 'What'll ya have?' catchphrase.",
  //         },
  //         {
  //           stop_name: "Mary Mac's Tea Room",
  //           time_spent: "2 hours",
  //           address: "224 Ponce de Leon Ave NE, Atlanta, GA 30308",
  //           description:
  //             "Conclude your foodie journey at Mary Mac's Tea Room, an Atlanta landmark known for its traditional Southern dishes and famous sweet tea.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delectable foodie road trip from Memphis to Atlanta, savoring diverse and delicious cuisines along the way. Enjoy Memphis-style BBQ at Central BBQ, indulge in Southern comfort food at City Cafe Diner, and explore a variety of eateries at Ponce City Market. Try classic hot dogs and burgers at The Varsity, and conclude your journey with traditional Southern dishes at Mary Mac's Tea Room. Get ready for a savory and delightful culinary adventure through the South.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "National Civil Rights Museum",
  //           time_spent: "3 hours",
  //           address: "450 Mulberry St, Memphis, TN 38103",
  //           description:
  //             "Start your cultural journey at the National Civil Rights Museum in Memphis, located at the historic Lorraine Motel, commemorating the Civil Rights Movement.",
  //         },
  //         {
  //           stop_name: "The King Center",
  //           time_spent: "2.5 hours",
  //           address: "449 Auburn Ave NE, Atlanta, GA 30312",
  //           description:
  //             "Pay tribute to the legacy of Martin Luther King Jr. at The King Center in Atlanta, featuring exhibits on civil rights and social justice.",
  //         },
  //         {
  //           stop_name: "The High Museum of Art",
  //           time_spent: "3 hours",
  //           address: "1280 Peachtree St NE, Atlanta, GA 30309",
  //           description:
  //             "Explore The High Museum of Art in Atlanta, known for its diverse collection of artworks ranging from classic to contemporary.",
  //         },
  //         {
  //           stop_name: "Atlanta History Center",
  //           time_spent: "3 hours",
  //           address: "130 W Paces Ferry Rd NW, Atlanta, GA 30305",
  //           description:
  //             "Learn about the history of Atlanta and the American South at the Atlanta History Center, featuring exhibits, gardens, and historic homes.",
  //         },
  //         {
  //           stop_name: "Martin Luther King Jr. National Historic Park",
  //           time_spent: "2.5 hours",
  //           address: "450 Auburn Ave NE, Atlanta, GA 30312",
  //           description:
  //             "Conclude your cultural journey at the Martin Luther King Jr. National Historic Park, which includes the birthplace, church, and final resting place of MLK Jr.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Memphis to Atlanta, exploring arts, history, and the legacy of civil rights. Visit the National Civil Rights Museum in Memphis and pay tribute to Martin Luther King Jr. at The King Center in Atlanta. Explore The High Museum of Art, learn about Atlanta's history at the Atlanta History Center, and conclude your journey at the Martin Luther King Jr. National Historic Park. Get ready to delve into the rich cultural heritage of the Southern region on this enriching road trip.",
  //     },
  //   },
  //   "Memphis-to-Little-Rock": {
  //     Eccentric: {
  //       stops: [
  //         {
  //           stop_name: "Mud Island River Park",
  //           time_spent: "2 hours",
  //           address: "125 N Front St, Memphis, TN 38103",
  //           description:
  //             "Start your eccentric road trip at Mud Island River Park in Memphis, where you can walk along the Riverwalk, explore the Mississippi River Museum, and even dip your toes in the Riverwalk's model of the Mississippi River.",
  //         },
  //         {
  //           stop_name: "Toad Suck Park",
  //           time_spent: "1.5 hours",
  //           address: "301 Toad Suck Park Rd, Bigelow, AR 72016",
  //           description:
  //             "Encounter the quirky-named Toad Suck Park in Bigelow, AR, where you can enjoy nature trails and fishing along the Arkansas River.",
  //         },
  //         {
  //           stop_name: "Bottle Tree Ranch",
  //           time_spent: "1 hour",
  //           address: "N Old 66 Blvd, Oro Grande, CA 92368",
  //           description:
  //             "While not directly on the way to Little Rock, Bottle Tree Ranch is an eccentric stop worth the detour. Experience the visual delight of thousands of colorful glass bottles arranged into art installations.",
  //         },
  //         {
  //           stop_name: "The Esse Purse Museum",
  //           time_spent: "1.5 hours",
  //           address: "1510 Main St, Little Rock, AR 72202",
  //           description:
  //             "Visit The Esse Purse Museum in Little Rock, dedicated to showcasing the history and evolution of women's purses and handbags.",
  //         },
  //         {
  //           stop_name: "Pinnacle Mountain State Park",
  //           time_spent: "2.5 hours",
  //           address: "11901 Pinnacle Valley Rd, Roland, AR 72135",
  //           description:
  //             "Conclude your eccentric journey with a visit to Pinnacle Mountain State Park, offering hiking trails and stunning views from the summit.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on an eccentric road trip from Memphis to Little Rock, encountering quirky attractions and offbeat wonders along the way. Walk along the Riverwalk at Mud Island River Park, visit Toad Suck Park, and make a detour to experience the colorful Bottle Tree Ranch. Explore The Esse Purse Museum and conclude your journey with hiking at Pinnacle Mountain State Park. Get ready for a weird and entertaining adventure through the South.",
  //     },
  //     Nature: {
  //       stops: [
  //         {
  //           stop_name: "Hot Springs National Park",
  //           time_spent: "1.5 days",
  //           address: "101 Reserve St, Hot Springs, AR 71901",
  //           description:
  //             "Start your nature retreat at Hot Springs National Park, where you can soak in natural hot springs and explore hiking trails.",
  //         },
  //         {
  //           stop_name: "Ouachita National Forest",
  //           time_spent: "2 days",
  //           address: "100 Reserve St, Hot Springs, AR 71901",
  //           description:
  //             "Immerse yourself in the beauty of Ouachita National Forest, offering scenic drives, hiking opportunities, and peaceful camping sites.",
  //         },
  //         {
  //           stop_name: "Petit Jean State Park",
  //           time_spent: "1.5 days",
  //           address: "1285 Petit Jean Mountain Rd, Morrilton, AR 72110",
  //           description:
  //             "Visit Petit Jean State Park, known for its stunning overlooks, waterfalls, and beautiful Cedar Falls Trail.",
  //         },
  //         {
  //           stop_name: "Big Dam Bridge",
  //           time_spent: "1.5 hours",
  //           address: "Murray Park, Little Rock, AR 72202",
  //           description:
  //             "Take a relaxing walk or bike ride on the Big Dam Bridge, offering scenic views of the Arkansas River and city skyline.",
  //         },
  //         {
  //           stop_name: "Pinnacle Mountain State Park",
  //           time_spent: "2.5 hours",
  //           address: "11901 Pinnacle Valley Rd, Roland, AR 72135",
  //           description:
  //             "Conclude your nature-filled journey with a visit to Pinnacle Mountain State Park, offering hiking trails and stunning views from the summit.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a scenic nature road trip from Memphis to Little Rock, exploring serene rivers, lush forests, and picturesque views. Soak in natural hot springs at Hot Springs National Park, immerse yourself in the beauty of Ouachita National Forest, and visit Petit Jean State Park with its stunning overlooks and waterfalls. Take a walk on the Big Dam Bridge and conclude your journey with hiking at Pinnacle Mountain State Park. Get ready to rejuvenate your senses on this refreshing nature retreat through the South.",
  //     },
  //     Foodie: {
  //       stops: [
  //         {
  //           stop_name: "Gus's World Famous Fried Chicken",
  //           time_spent: "1.5 hours",
  //           address: "310 S Front St, Memphis, TN 38103",
  //           description:
  //             "Start your foodie adventure with a taste of Gus's World Famous Fried Chicken in Memphis, known for its spicy and crispy fried chicken.",
  //         },
  //         {
  //           stop_name: "Rhoda's Famous Hot Tamales",
  //           time_spent: "1 hour",
  //           address: "748 S Highland St, Memphis, TN 38111",
  //           description:
  //             "Indulge in Rhoda's Famous Hot Tamales, a Memphis institution serving authentic and flavorful tamales.",
  //         },
  //         {
  //           stop_name: "Lassis Inn",
  //           time_spent: "1.5 hours",
  //           address: "518 E 27th St, Little Rock, AR 72206",
  //           description:
  //             "Savor a taste of soulful catfish at Lassis Inn in Little Rock, known for its iconic catfish and hush puppies.",
  //         },
  //         {
  //           stop_name: "The Root Cafe",
  //           time_spent: "2 hours",
  //           address: "1500 Main St, Little Rock, AR 72202",
  //           description:
  //             "Enjoy farm-to-table goodness at The Root Cafe, where you'll find locally sourced and delicious dishes.",
  //         },
  //         {
  //           stop_name: "Doe's Eat Place",
  //           time_spent: "2 hours",
  //           address: "1023 W Markham St, Little Rock, AR 72201",
  //           description:
  //             "Conclude your foodie journey at Doe's Eat Place, a classic steakhouse in Little Rock, serving mouthwatering steaks and tamales.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a delightful foodie road trip from Memphis to Little Rock, savoring delectable cuisines and culinary delights along the way. Enjoy Gus's World Famous Fried Chicken and Rhoda's Famous Hot Tamales in Memphis. Savor soulful catfish at Lassis Inn and farm-to-table goodness at The Root Cafe in Little Rock. Conclude your journey at Doe's Eat Place, a classic steakhouse serving mouthwatering steaks and tamales. Get ready for a savory culinary adventure through the South.",
  //     },
  //     Culture: {
  //       stops: [
  //         {
  //           stop_name: "Stax Museum of American Soul Music",
  //           time_spent: "2 hours",
  //           address: "926 E McLemore Ave, Memphis, TN 38106",
  //           description:
  //             "Start your cultural journey at the Stax Museum of American Soul Music in Memphis, celebrating the legacy of soul music and iconic artists.",
  //         },
  //         {
  //           stop_name: "Historic Arkansas Museum",
  //           time_spent: "2 hours",
  //           address: "200 E 3rd St, Little Rock, AR 72201",
  //           description:
  //             "Explore the Historic Arkansas Museum in Little Rock, featuring historic houses, galleries, and exhibits on the state's history.",
  //         },
  //         {
  //           stop_name: "Sun Studio",
  //           time_spent: "1.5 hours",
  //           address: "706 Union Ave, Memphis, TN 38103",
  //           description:
  //             "Visit Sun Studio in Memphis, often referred to as the birthplace of rock 'n' roll, where legendary artists like Elvis Presley recorded their music.",
  //         },
  //         {
  //           stop_name: "Clinton Presidential Library and Museum",
  //           time_spent: "2.5 hours",
  //           address: "1200 President Clinton Ave, Little Rock, AR 72201",
  //           description:
  //             "Learn about the history and presidency of Bill Clinton at the Clinton Presidential Library and Museum in Little Rock.",
  //         },
  //         {
  //           stop_name: "Beale Street",
  //           time_spent: "2 hours",
  //           address: "Beale St, Memphis, TN 38103",
  //           description:
  //             "Conclude your cultural journey on Beale Street in Memphis, known for its vibrant music scene, historic buildings, and lively atmosphere.",
  //         },
  //       ],
  //       seo_description:
  //         "Embark on a captivating cultural road trip from Memphis to Little Rock, exploring arts, history, and music that define the essence of Southern culture. Visit the Stax Museum of American Soul Music and Sun Studio in Memphis, and learn about Bill Clinton's presidency at the Clinton Presidential Library and Museum. Explore the Historic Arkansas Museum in Little Rock and conclude your journey on Beale Street, known for its vibrant music scene. Get ready for an enriching cultural adventure through the South.",
  //     },
  //   },
};

export default function TripGuide(): JSX.Element {
  const params = useParams();
  const [title, setTitle] = useState("");
  const [tripGuides, setTripGuides] = useState<{
    Eccentric: {
      seo_description: string;
      stops: {
        _id: string;
        place_id: string;
        stop_name: string;
        time_spent: string;
        address: string;
        description: string;
      }[];
    };
    Nature: {
      seo_description: string;
      stops: {
        _id: string;
        place_id: string;
        stop_name: string;
        time_spent: string;
        address: string;
        description: string;
      }[];
    };
    Foodie: {
      seo_description: string;
      stops: {
        _id: string;
        place_id: string;
        stop_name: string;
        time_spent: string;
        address: string;
        description: string;
      }[];
    };
    Culture: {
      seo_description: string;
      stops: {
        _id: string;
        place_id: string;
        stop_name: string;
        time_spent: string;
        address: string;
        description: string;
      }[];
    };
  }>({
    Eccentric: { seo_description: "", stops: [] },
    Nature: { seo_description: "", stops: [] },
    Foodie: { seo_description: "", stops: [] },
    Culture: { seo_description: "", stops: [] },
  });
  const [chosenTheme, setChosenTheme] = useState<
    "Eccentric" | "Nature" | "Foodie" | "Culture"
  >("Eccentric");
  const themes = ["Eccentric", "Nature", "Foodie", "Culture"];

  useEffect(() => {
    if (params.name && params.name in guides) {
      setTitle(params.name.replaceAll("-", " "));
      setTripGuides(guides[params.name]);
    } else {
      console.log("unavailable guide endpoints");
    }
  }, [params.name]);

  return (
    <Container sx={{ height: "100%", p: 2 }}>
      <Typography variant="h1">{title}</Typography>
      <Typography variant="h2">Overview</Typography>
      <ToggleButtonGroup
        value={chosenTheme}
        exclusive
        onChange={(
          event,
          newTheme: "Eccentric" | "Nature" | "Foodie" | "Culture"
        ) => {
          setChosenTheme(newTheme);
        }}
        aria-label="outlined button group"
        sx={{ pl: 4, pt: 2 }}
      >
        <ToggleButton value="Eccentric" aria-label="eccentric">
          Eccentric
        </ToggleButton>
        <ToggleButton value="Nature" aria-label="nature">
          Nature
        </ToggleButton>
        <ToggleButton value="Foodie" aria-label="foodie">
          Foodie
        </ToggleButton>
        <ToggleButton value="Culture" aria-label="culture">
          Culture
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body1">
        {tripGuides[chosenTheme].seo_description}
      </Typography>
      <Button>Open this trip in the planner</Button>
      <Typography variant="h2">Stops</Typography>
      <List>
        {tripGuides[chosenTheme].stops.map((stop, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={stop.stop_name}
              secondary={stop.description + " " + stop.time_spent}
            />
          </ListItem>
        ))}
      </List>
      {/* <Typography variant="h3">Other Guides</Typography>
       <List>
        {guides.map((guide) => (
          <ListItem>
            <ListItemText primary={guide.name} />
          </ListItem>
        ))}
        </List> */}
    </Container>
  );
}
