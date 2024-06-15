import { ReactElement } from 'react';
import { CiCoffeeCup, CiCreditCard1, CiWallet } from 'react-icons/ci';
import { FaHamburger, FaPiggyBank, FaHandHoldingUsd } from 'react-icons/fa';
import {
  FaBus, FaGamepad, FaGasPump, FaShirt,
} from 'react-icons/fa6';
import { IoIosCart } from 'react-icons/io';

const arr = [
  <FaShirt size="1.5em" key="0" />,
  <CiCoffeeCup size="1.5em" key="1" />,
  <FaHamburger size="1.5em" key="2" />,
  <FaGasPump size="1.5em" key="3" />,
  <FaBus size="1.5em" key="4" />,
  <FaGamepad size="1.5em" key="5" />,
  <IoIosCart size="1.5em" key="6" />,
  <CiCreditCard1 size="1.5em" key="7" />,
  <CiWallet size="1.5em" key="8" />,
  <FaPiggyBank size="1.5em" key="9" />,
  <FaHandHoldingUsd size="1.5em" key="10" />,
];

function useIcons() : ReactElement[] {
  return arr;
}

export default useIcons;
