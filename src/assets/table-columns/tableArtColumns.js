// src/components/tableUserColumns.js
import EditIcon from "../icons/edit.svg";

export const getArtColumns = (editHandler) => [
    {
        name: "Id",
        selector: row => row.id,
        sortable: true,
    },
    {
        name: "Title",
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Description',
        selector: row => row.description,
        sortable: true,
    },
    {
        name: 'Price (€)',
        selector: row => row.price,
        sortable: true
    },
    {
        name: "Date",
        selector: row => row.date,
        sortable: true
    },
    {
        name: "Edit",
        cell: (row) => <button className="button-edit" onClick={() => editHandler(row)}>
            <img src={EditIcon} alt="Edit Icon"/>
        </button>
    }
];