const testContact = {
    email: 'mcottingham@razorsharpconsulting.com',
    firstName: 'Mike',
    lastName: 'Cottingham',
}

const updateContactStorage = (contacts) => {
    const textContacts = JSON.stringify(contacts)
    return window.localStorage.setItem('contacts', textContacts)
}

const getContactsFromStorage = () => {
    const textContacts = window.localStorage.getItem('contacts')
    return JSON.parse(textContacts) || []
}

const renderHTMLTextElem = (tag, text) => {
    const element = document.createElement(tag)
    const textNode = document.createTextNode(text)
    element.appendChild(textNode)
    return element
}

const renderButton = (title, onClick) => {
    const buttonElem = document.createElement('button')
    buttonElem.innerText = title
    buttonElem.onclick = onClick
    return buttonElem
}


window.onload = () => {
    let contacts = getContactsFromStorage()
    const addContactButton = document.getElementById('add-contact')
    const addContactForm = document.getElementById('add-contact-form')
    const cancelButton = document.getElementById('cancel')

    const renderContactsList = () => {
        const contactsList = document.getElementById('contacts')
        contactsList.innerHTML = ''
        contacts.map((contact) => {
            contactsList.append(renderContactListItem(contact))
        })

        if (!contacts.length) {
            contactsList.appendChild(renderHTMLTextElem('p', 'No contacts yet.  Add one to get started!'))
        }
    }

    const onEditContact = (contact) => {
        addContactForm.elements.firstName.value = contact.firstName
        addContactForm.elements.lastName.value = contact.lastName
        addContactForm.elements.email.value = contact.email
        addContactForm.elements.email.disabled = true
        addContactForm.style.display = 'block'
    }

    const onDeleteContact = (contact) => {
        const idx = contacts.findIndex(c => c.email === contact.email)
        if (idx > -1) {
            contacts = [...contacts.slice(0, idx), ...contacts.slice(idx + 1)]
            updateContactStorage(contacts)
            renderContactsList()
        }
    }

    const renderContactListItem = (contact) => {
        const { email, firstName, lastName } = contact
        const li = document.createElement('li')
        li.id = email

        const contactContainer = document.createElement('div')
        const nameElement = renderHTMLTextElem('h3', `${firstName} ${lastName}`)
        const emailElement = renderHTMLTextElem('span', `${email}`)
        const editButton = renderButton('Edit', () => onEditContact(contact))
        const deleteButton = renderButton('Delete', () => onDeleteContact(contact))


        contactContainer.appendChild(nameElement)
        contactContainer.appendChild(emailElement)
        contactContainer.appendChild(editButton)
        contactContainer.appendChild(deleteButton)

        li.appendChild(contactContainer)
        return li
    }

    const resetForm = () => {
        const addContactForm = document.getElementById('add-contact-form')
        addContactForm.reset()
        addContactForm.style.display = 'none'
        addContactForm.elements.email.disabled = false
    }

    const contactIsValid = (contact) => {
        return contacts.findIndex((c) => c.email === contact.email) === -1  //Valid when email not found
    }


    addContactButton.onclick = (e) => {
        e.preventDefault()
        resetForm()
        addContactForm.style.display = 'block'
    }

    cancelButton.onclick = (e) => {
        e.preventDefault()
        resetForm()
    }

    addContactForm.onsubmit = (e) => {
        e.preventDefault()
        const { email, firstName, lastName } = e.target.elements    //extract form elements

        //extract form data
        const contact = {
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
        }

        if (!contactIsValid(contact) && !email.disabled) {
            alert('Email already exists')
        }
        else {
            if (!email.disabled) {
                contacts.push(contact)
            } else {
                let contactToUpdate = contacts.find(c => c.email === contact.email)
                contactToUpdate.firstName = contact.firstName
                contactToUpdate.lastName = contact.lastName
            }
            updateContactStorage(contacts)
            resetForm()
            renderContactsList()
        }
    }

    renderContactsList()
}