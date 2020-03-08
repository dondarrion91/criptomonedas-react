import React,{useEffect,useState} from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import Error from './Error';


import useMoneda from '../hooks/useMoneda';
import useCriptomonedas from '../hooks/useCriptomonedas';

import axios from 'axios';

const Boton = styled.input`
  margin-top:20px;
  font-weight: bold;
  font-size: 20px;
  padding:20px;
  background-color:#66a2fe;
  border:none;
  width:100%;
  border-radius:10px;
  color:#fff;
  transition: background-color .3s ease;

  &:hover{
      background-color:#326ac0;
      cursor:pointer;
  }
`;


const Formulario = ({guardarMoneda,guardarCriptomoneda}) => {

    //state del listado de criptomoneas
    const [listacripto, guardarCriptomonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        {codigo: 'USD' , nombre: "Dolar de Estados Unidos"},
        {codigo: 'MXN' , nombre: "Peso Mexicano"},
        {codigo: 'EUR' , nombre: "Euro"},
        {codigo: 'GBP' , nombre: "Libra Esterlina"},
        {codigo: 'ARS' , nombre: "Peso Argentino"}
    ]

    //useMoneda
    const [moneda, SelectMonedas, actualizarState] = useMoneda('Elige tu moneda', '',MONEDAS);

    //useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomonedas('Elige tu Criptomoneda','',listacripto);

    useEffect(() =>{
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);

            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI();
    },[])

    //submit
    const cotizarMoneda = e => {
        e.preventDefault();

        //validar si ambos campos estan llenos
        if(moneda === '' || criptomoneda === ''){
            guardarError(true);
            return;
        }

        //pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }

    return ( 
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los Campos Son Obligatorios"/> : null}

            <SelectMonedas/>
            <SelectCripto/>
            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
     );
}

Formulario.propTypes = {
    guardarMoneda: PropTypes.func.isRequired,
    guardarCriptomoneda: PropTypes.func.isRequired
}

export default Formulario;