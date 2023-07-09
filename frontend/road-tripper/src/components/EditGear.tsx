import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import {
  TextField,
  Typography,
  Chip,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ProfileProps } from "../pages/Profile";
import { useMutation } from "../core/api";

interface GearItem {
  name: string;
  description: string;
  quantity: number;
  borrowable: boolean;
}

export function GearList(props: { gear: GearItem[] }): JSX.Element {
  const available = props.gear.filter((item) => item.borrowable);
  const unavailable = props.gear.filter((item) => !item.borrowable);

  return (
    <div>
      <Typography variant="h5">Available Gear</Typography>
      <List>
        {available.map((item: GearItem, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.name + " (" + item.quantity + ")"}
              secondary={item.description}
            />{" "}
          </ListItem>
        ))}
      </List>
      <Typography variant="h5">Unvailable Gear</Typography>
      <List>
        {unavailable.map((item: GearItem, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.name + " (" + item.quantity + ")"}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export function EditGear(props: ProfileProps): JSX.Element {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [borrowable, setBorrowable] = useState<boolean>(false);
  const [items, setItems] = useState<GearItem[]>(props.gear ?? []);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const nameRef = useRef<HTMLInputElement>(null);

  const updateProfile = useMutation("UpdateProfile");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleBorrowableChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBorrowable(event.target.checked);
  };

  const handleAddItem = async () => {
    const newItem = {
      name,
      description,
      quantity,
      borrowable,
    };
    const updateRes = await updateProfile.commit({
      ...props,
      gear: [...items, newItem],
    });
    setItems((prevItems) => [...prevItems, newItem]);
    setName("");
    setDescription("");
    setQuantity(0);
    setBorrowable(false);
    if (nameRef.current) nameRef.current.focus();
  };

  const handleChipClick = (index: number) => {
    if (index === selectedItemIndex) {
      setSelectedItemIndex(-1);
      setName("");
      setDescription("");
      setQuantity(0);
      setBorrowable(false);
    } else {
      setSelectedItemIndex(index);
      const { name, description, quantity, borrowable } = items[index];
      setName(name);
      setDescription(description);
      setQuantity(quantity);
      setBorrowable(borrowable);
    }
    if (nameRef.current) nameRef.current.focus();
  };

  const handleChipDelete = async (index: number) => {
    setItems((prevItems) => prevItems.filter((item, i) => i !== index));
    const updateRes = await updateProfile.commit({ ...props, gear: items });
  };

  const handleUpdateItem = async () => {
    if (selectedItemIndex !== -1) {
      const updatedItem = {
        name,
        description,
        quantity,
        borrowable,
      };

      const updatedItems = items.map((item, index) =>
        index === selectedItemIndex ? updatedItem : item
      );
      const updateRes = await updateProfile.commit({
        ...props,
        gear: updatedItems,
      });
      setItems(updatedItems);
      setName("");
      setDescription("");
      setQuantity(0);
      setBorrowable(false);
      setSelectedItemIndex(-1);
      if (nameRef.current) nameRef.current.focus();
    }
  };

  return (
    <div>
      <div>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          {items.map((item, index) => (
            <Chip
              key={index}
              label={`${item.name} (${item.quantity}) - ${item.description}`}
              style={{ margin: "4px" }}
              clickable
              onClick={() => handleChipClick(index)}
              onDelete={() => handleChipDelete(index)}
              color={selectedItemIndex === index ? "primary" : "default"}
            />
          ))}
        </Box>
      </div>
      <TextField
        label="Name"
        value={name}
        onChange={handleNameChange}
        inputRef={nameRef}
        fullWidth
        sx={{ mb: 2, mt: 2 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={handleQuantityChange}
        type="number"
        sx={{ mb: 2, mr: 2 }}
      />
      <FormControlLabel
        control={
          <Checkbox checked={borrowable} onChange={handleBorrowableChange} />
        }
        label="Borrowable"
      />
      {selectedItemIndex !== -1 ? (
        <Button variant="contained" onClick={handleUpdateItem}>
          Update Item
        </Button>
      ) : (
        <Button variant="contained" onClick={handleAddItem}>
          Add Item
        </Button>
      )}
    </div>
  );
}
