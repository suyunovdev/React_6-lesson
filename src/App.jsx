import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl, Row, Col, Spinner, Tabs, Tab } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import edit from "./assets/components/images/edit.svg";
import del from "../src/assets/components/images/delete.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    group: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [key, setKey] = useState('all');

  const gender = ['Male', 'Female'];

  // Load contacts from localStorage on initial render
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (storedContacts) {
      setContacts(storedContacts);
    }
  }, []);

  // Save contacts to localStorage whenever contacts state changes
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEditing) {
      setContacts(contacts.map(contact =>
        contact.id === currentContactId ? { ...formData, id: currentContactId } : contact
      ));
      toast.success('Contact updated successfully');
      setIsEditing(false);
      setCurrentContactId(null);
    } else {
      setContacts([...contacts, { ...formData, id: uuidv4() }]);
      toast.success('Contact added successfully');
    }
    setShowModal(false);
    setFormData({ firstName: '', lastName: '', contact: '', group: '' });
    setLoading(false);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentContactId(null);
    setFormData({ firstName: '', lastName: '', contact: '', group: '' });
  };

  const handleEdit = (contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      contact: contact.contact,
      group: contact.group
    });
    setCurrentContactId(contact.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.error('Contact deleted successfully');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupFilterChange = (e) => {
    setFilterGroup(e.target.value);
  };

  const toggleFavorite = (id) => {
    setContacts(contacts.map(contact =>
      contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
    ));
  };

  const filteredContacts = contacts.filter((contact) => {
    return (
      (contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.group.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterGroup === "" || contact.group === filterGroup)
    );
  });

  const favoriteContacts = filteredContacts.filter(contact => contact.favorite);

  return (
    <div className="container mx-auto">
      <div className="rows container mx-auto   d-flex justify-content-around ">
        <Row className="mt-3 my-auto">
          <Col>
            <InputGroup className='w-96' >
              <FormControl
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Select value={filterGroup} onChange={handleGroupFilterChange} className="border border-gray-300 rounded-md py-2 px-4">
              <option value="">All</option>
              {gender.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Button variant="primary" onClick={openModal} className="mt-3">Add Contact</Button>
      </div>
      
      <Tabs
        id="contact-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mt-4"
      >
        <Tab eventKey="all" title="All Contacts">
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Actions</th>
                <th className="px-4 py-2">Favorite</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-4 py-2">{contact.firstName}</td>
                  <td className="px-4 py-2">{contact.lastName}</td>
                  <td className="px-4 py-2">{contact.contact}</td>
                  <td className="px-4 py-2">{contact.group}</td>
                  <td className="px-4 py-2">
                    <Button variant="warning" onClick={() => handleEdit(contact)}>
                      <img src={edit} alt="edit" className="h-5 w-5" />
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(contact.id)}>
                      <img src={del} alt="delete" className="h-5 w-5" />
                    </Button>
                  </td>
                  <td className="px-4 py-2">
                    <Button variant={contact.favorite ? "success" : "outline-success"} onClick={() => toggleFavorite(contact.id)}>
                      {contact.favorite ? "❤️" : "🤍"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="favorites" title="Favorite Contacts">
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Actions</th>
                <th className="px-4 py-2">Favorite ❤️</th>
              </tr>
            </thead>
            <tbody>
              {favoriteContacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-4 py-2">{contact.firstName}</td>
                  <td className="px-4 py-2">{contact.lastName}</td>
                  <td className="px-4 py-2">{contact.contact}</td>
                  <td className="px-4 py-2">{contact.group}</td>
                  <td className="px-4 py-2">
                    <Button variant="warning" onClick={() => handleEdit(contact)}>
                      <img src={edit} alt="edit" className="h-5 w-5" />
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(contact.id)}>
                      <img src={del} alt="delete" className="h-5 w-5" />
                    </Button>
                  </td>
                  <td className="px-4 py-2">
                    <Button variant={contact.favorite ? "success" : "outline-success"} onClick={() => toggleFavorite(contact.id)}>
                      {contact.favorite ? "❤️" : "🤍"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Contact' : 'Add Contact'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formContact">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                name="contact"
                placeholder='+998'
                value={formData.contact}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroup">
                <Form.Label>Gender</Form.Label>   
              <Form.Control
                as="select"
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded-md py-2 px-4"
              >
                <option value="">Select Gender</option>
                {gender.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} className="py-2 px-4">
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : isEditing ? 'Update Contact' : 'Add Contact'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default App;
