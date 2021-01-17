import React, { useState } from "react";
import { default as DropdownComponent } from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const Dropdown = ({ title, options, setStateForm, stateForm }) => {
    const [titleState, setTitle] = useState(title);
    const handleSelect = async (e) => {
        let option = options.filter((opt) => opt.value === e);
        options.map((opt) => console.log(opt));
        console.log(option[0]);
        setTitle(option[0].label);
        await setStateForm({
            ...stateForm,
            cat_id: { value: option[0].value, label: option[0].label },
        });
    };
    return (
        <DropdownButton
            id="dropdown-item-button"
            title={stateForm.cat_id?.label ?? titleState}
            onSelect={handleSelect}
        >
            {options.map((opt) => (
                <DropdownComponent.Item eventKey={opt.value} key={opt.value}>
                    {opt.label}
                </DropdownComponent.Item>
            ))}
        </DropdownButton>
    );
};

export default Dropdown;
