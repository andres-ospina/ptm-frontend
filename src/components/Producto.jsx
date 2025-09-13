import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import { Modal } from 'bootstrap';


const Producto = () => {


    const url = 'http://localhost:5002/api/producto';
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [totalInventory, setTotalInventory] = useState('');
    const [numericValue, setNumericValue] = useState('');
    const [combinations, setCombinations] = useState([]);
    const [catInfoOne, setCatInfoOne] = useState('');
    const [catInfoTwo, setCatInfoTwo] = useState('');
    const [uselessfactsText, setUselessfactsText] = useState('');
 

    useEffect(() => {
        getProducts();
        getTotalInventory();
        getCatInfo();
        getUselessfacts();
    }, []);

    const getProducts = async () => {
        await axios({ method: 'GET', url }).then(function (result) {
            setProducts(result.data.data);

        }).catch(function (error) {
            setProducts([]);
            show_alerta('Error en la solicitud', 'error');

        })
    }

    const getTotalInventory = async () => {
        await axios({ method: 'GET', url: url + '/total-invetory' }).then(function (result) {
            setTotalInventory(result.data.data);

        }).catch(function (error) {
            setTotalInventory('');
            show_alerta('Error en la solicitud', 'error');

        })
    }

    const openModal = (op, id, name, description, price, stockQuantity) => {
        setId('');
        setName('');
        setDescription('');
        setPrice('');
        setStockQuantity('');
        setOperation(op);
        if (op == 1) {
            setTitle('Registrar Producto');
        } else if (op == 2) {
            setTitle('Editar Producto');
            setId(id);
            setName(name);
            setDescription(description);
            setPrice(price);
            setStockQuantity(stockQuantity);

        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);


    }


    const validar = () => {
        var data;
        var method;
        var priceNumber = Number(price);
        var stockQuantityNumber = Number(stockQuantity);

        var priceString = '' + price;
        var stockQuantityString = '' + stockQuantity;

        if (name.trim() == '') {
            show_alerta('Escribe el nombre del producto', 'warning');
        } else if (description.trim() == '') {
            show_alerta('Escribe la descripciòn del producto', 'warning');
        } else if (priceString.trim() == '') {
            show_alerta('Escribe el precio del producto', 'warning');
        } else if (stockQuantityString.trim() == '') {
            show_alerta('Escribe la cantidad del producto', 'warning');
        } else if (priceNumber < 0) {
            show_alerta('el precio del producto debe ser mayor a 0 ', 'warning');
        } else if (stockQuantityNumber < 0) {
            show_alerta('La cantidad del producto debe ser mayor a 0', 'warning');
        } else {
            if (operation === 1) {
                data = { name: name.trim(), description: description.trim(), price: priceNumber, stockQuantity: stockQuantityNumber };
                method = 'POST'
            } else if (operation === 2) {
                data = { id: id, name: name.trim(), description: description.trim(), price: priceNumber, stockQuantity: stockQuantityNumber };
                method = 'PUT'
            }
            sendRequest(method, data);
        }


    }

    const sendRequest = async (method, data) => {
        if (method == 'POST') {
            await axios({ method: method, url: url, data }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }).then(function (result) {
                var status = result.data.status;

                if (status == 200) {
                    show_alerta('Se realizo el registro', 'success');
                    document.getElementById('btnCerrar').click();
                    getProducts();
                }

            }).catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
            })

        } else if (method == 'PUT') {
            await axios({ method: method, url: url + '/' + data.id, data }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }).then(function (result) {
                var status = result.data.status;
                if (status == 200) {
                    show_alerta('Se actualizo el registro', 'success');
                    document.getElementById('btnCerrar').click();
                    getProducts();
                }
            }).catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
            })
        } else if (method == 'DELETE') {
            await axios({ method: method, url: url + '/' + data.id }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }).then(function (result) {
                var status = result.data.status;
                if (status == 200) {
                    show_alerta('Se elimino el registro', 'success');
                    getProducts();
                }
            }).catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
            })

        }

    }

    const deleteProduct = (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Desea eliminar el producto ' + name + '?',
            icon: 'question',
            text: 'Esta seguro!',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                sendRequest('DELETE', { id: id });
            } else {
                show_alerta('El producto No fue eliminado', 'info');
            }
        });



    }

    const validateNumber = () => {
        var numericValueNumber = Number(numericValue);

        if (numericValueNumber < 0) {
            show_alerta('La cantidad ingresada debe ser mayor a 0', 'warning');
        } else {
            search(numericValue);
        }

    }

    const search = async (numericValue) => {

        await axios({ method: 'GET', url: url + '/list-combinations/' + numericValue }).then(function (result) {

            setCombinations(result.data.data);

        }).catch(function (error) {
            setCombinations([]);
            show_alerta('Error en la solicitud', 'error');

        })

    }

    const getCatInfo = async () => {
        await axios({ method: 'GET', url: 'https://meowfacts.herokuapp.com/' }).then(function (result) {

            setCatInfoOne(result.data.data);

            window.setTimeout(function () {
                getCatInfoTwo();
                openModaltCatInfo();
                

            }, 500);


        }).catch(function (error) {

            setCatInfoOne('');
            show_alerta('Error en la solicitud', 'error');

        })



    }


    const getCatInfoTwo = async () => {
        await axios({ method: 'GET', url: 'https://meowfacts.herokuapp.com/' }).then(function (result) {
            setCatInfoTwo(result.data.data);
        }).catch(function (error) {
            setCatInfoTwo('');
            show_alerta('Error en la solicitud', 'error');

        })



    }

    const openModaltCatInfo = () => {
        const modalEl = document.getElementById('modalCatInfo');
        const modal = new Modal(modalEl); 
        modal.show(); 
      };

      const closeModaltCatInfo = () => {
        const modalEl = document.getElementById('modalCatInfo');
        const modal = new Modal(modalEl); 
        modal.hide(); 
      }; 
      

    const getUselessfacts = async() => {
        await axios({ method: 'GET', url: 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en' }).then(function (result) {
           
            setUselessfactsText(result.data.text);
            
        }).catch(function (error) {
            show_alerta('Error en la solicitud', 'error');

        })

    }

    return (
        <div className='App'>
         
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <p className='text-primary'>Valor total del inventario <span className='text-success'>${new Intl.NumberFormat('es-co').format(totalInventory)}</span></p>
                        </div>

                        <div className='d-grid mx-auto mb-3'>
                            <div className='input-group mb-2'>
                                <span className='input-group-text'><i className="fa-solid fa-money-bill"></i></span>
                                <input type='number' id='valornumerico' className='form-control' placeholder='Valor numerico' value={numericValue}
                                    onChange={(e) => setNumericValue(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validateNumber()} className='btn btn-primary' >
                                    <i className='fa-solid fa-magnifying-glass-dollar'></i> Consultar
                                </button>
                            </div>
                        </div>
                        <div className='d-grid mx-auto mb-3'>

                            <div className='table-responsive'>
                                <table className='table table-borde'>
                                    <thead>
                                        <tr>
                                            <th>Combinaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-group-divider'>
                                        {combinations && combinations.map((obj) => (
                                            <tr key={obj.id}>
                                                <td>{obj.value}</td>
                                            </tr>
                                        ))

                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>


                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Agregar
                            </button>
                        </div>

                        
                         
                        
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-borde'>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Nombre</th>
                                        <th>Descripciòn</th>
                                        <th>Precio</th>
                                        <th>Cantidad en stock</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {products && products.map((obj) => (
                                        <tr key={obj.id}>
                                            <td>{obj.id}</td>
                                            <td>{obj.name}</td>
                                            <td>{obj.description}</td>
                                            <td>${new Intl.NumberFormat('es-co').format(obj.price)}</td>
                                            <td>{obj.stockQuantity}</td>
                                            <td>
                                                <button onClick={() => openModal(2, obj.id, obj.name, obj.description, obj.price, obj.stockQuantity)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteProduct(obj.id, obj.name)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>

                                    ))

                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id' ></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text' ><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name}
                                    onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='descripcion' className='form-control' placeholder='Descripcion' value={description}
                                    onChange={(e) => setDescription(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type='number' id='precio' className='form-control' placeholder='Precio' value={price}
                                    onChange={(e) => setPrice(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-warehouse'></i></span>
                                <input type='number' id='cantidad' className='form-control' placeholder='Cantidad' value={stockQuantity}
                                    onChange={(e) => setStockQuantity(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success' >
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>


                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' id='btnCerrar' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalCatInfo' className="modal fade"  aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>Sabìas que...</label>
                           
                        </div>
                        <div className='modal-body'>
                            <p className='text-success'>{catInfoOne}</p>

                            <p className='text-primary'>{catInfoTwo}</p>

                        </div>
                        
                    </div>
                </div>
            </div>

        
            

            <footer class="bg-primary text-white text-center py-3">
          
               <p className="mb-0">{uselessfactsText}</p>
               

            </footer>
        </div>


    )
}

export default Producto