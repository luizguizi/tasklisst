import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, remove } from 'firebase/database';

const Exclude = ({ taskId }) => {
  const handleRemove = () => {
    const database = getDatabase();
    const taskRef = ref(database, 'tasks/' + taskId);

    remove(taskRef)
      .then(() => {
        alert('Task removed!');
      })
      .catch((error) => {
        alert('Error removing task: ' + error.message);
      });
  };

  return (
    <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
      <Text style={styles.removeText}>X</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Exclude;