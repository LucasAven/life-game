import Select from "react-select";
import boxImage from "../img/box.gif";
import beeHiveImage from "../img/beehive.png";
import beaconImage from "../img/beacon.gif";
import blinkerImage from "../img/blinker.gif";
import boatImage from "../img/boat.png";
import flowerImage from "../img/flower.png";
import gliderImage from "../img/glider.gif";
import hwssImage from "../img/hwss.gif";
import iColumnImage from "../img/I-Column.gif";
import loafImage from "../img/loaf.png";
import lwssImage from "../img/lwss.gif";
import pulsarImage from "../img/pulsar.gif";
import toadImage from "../img/toad.gif";

const options = [
  {
    label: "Box",
    value: [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
    image: boxImage,
  },
  {
    label: "Bee Hive",
    value: [
      [0, 2],
      [0, 3],
      [1, 1],
      [1, 4],
      [2, 2],
      [2, 3],
    ],
    image: beeHiveImage,
  },
  {
    label: "Beacon",
    value: [
      [1, 1],
      [1, 2],
      [2, 1],
      [3, 4],
      [4, 3],
      [4, 4],
    ],
    image: beaconImage,
  },
  {
    label: "Blinker",
    value: [
      [1, 2],
      [2, 2],
      [3, 2],
    ],
    image: blinkerImage,
  },
  {
    label: "Boat",
    value: [
      [1, 2],
      [1, 3],
      [2, 2],
      [2, 4],
      [3, 3],
    ],
    image: boatImage,
  },
  {
    label: "Flower",
    value: [
      [1, 2],
      [2, 1],
      [2, 3],
      [3, 2],
    ],
    image: flowerImage,
  },
  {
    label: "Glider",
    value: [
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 2],
      [3, 3],
    ],
    image: gliderImage,
  },
  {
    label: "HWSS",
    value: [
      [2, 5],
      [2, 6],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 6],
      [3, 7],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [4, 6],
      [5, 3],
      [5, 4],
      [5, 5],
    ],
    image: hwssImage,
  },
  {
    label: "I Column",
    value: [
      [3, 5],
      [3, 6],
      [3, 7],
      [4, 5],
      [4, 7],
      [5, 5],
      [5, 6],
      [5, 7],
      [6, 5],
      [6, 6],
      [6, 7],
      [7, 5],
      [7, 6],
      [7, 7],
      [8, 5],
      [8, 6],
      [8, 7],
      [9, 5],
      [9, 7],
      [10, 5],
      [10, 6],
      [10, 7],
    ],
    image: iColumnImage,
  },
  {
    label: "Loaf",
    value: [
      [1, 3],
      [1, 4],
      [2, 2],
      [2, 5],
      [3, 3],
      [3, 5],
      [4, 4],
    ],
    image: loafImage,
  },
  {
    label: "LWSS",
    value: [
      [2, 4],
      [2, 5],
      [3, 2],
      [3, 3],
      [3, 5],
      [3, 6],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 3],
      [5, 4],
    ],
    image: lwssImage,
  },
  {
    label: "Pulsar",
    value: [
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 9],
      [1, 10],
      [1, 11],
      [3, 1],
      [3, 6],
      [3, 8],
      [3, 13],
      [4, 1],
      [4, 6],
      [4, 8],
      [4, 13],
      [5, 1],
      [5, 6],
      [5, 8],
      [5, 13],
      [6, 3],
      [6, 4],
      [6, 5],
      [6, 9],
      [6, 10],
      [6, 11],
      [8, 3],
      [8, 4],
      [8, 5],
      [8, 9],
      [8, 10],
      [8, 11],
      [9, 1],
      [9, 6],
      [9, 8],
      [9, 13],
      [10, 1],
      [10, 6],
      [10, 8],
      [10, 13],
      [11, 1],
      [11, 6],
      [11, 8],
      [11, 13],
      [13, 3],
      [13, 4],
      [13, 5],
      [13, 9],
      [13, 10],
      [13, 11],
    ],
    image: pulsarImage,
  },
  {
    label: "Toad",
    value: [
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
    image: toadImage,
  },
];

const FormsSelector = ({ onSelect }) => {
  return (
    <Select
      className="form-selector"
      placeholder="Seleccione una forma"
      options={options}
      onChange={(opt) => onSelect(opt.value)}
      isSearchable={false}
      formatOptionLabel={(form) => (
        <div className="form-option">
          <span>{form.label}</span>
          <img src={form.image} alt="form" />
        </div>
      )}
    />
  );
};

export default FormsSelector;
