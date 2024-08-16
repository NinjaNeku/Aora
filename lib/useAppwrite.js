import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

const useAppwrite = (fn) => {
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fn()
      setData(response)
    } catch (error) {
      Alert.alert('Error', error.message)
    }finally{
      setIsLoading(false);
    }
  }

    const [data, setData] = useState([])

    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      fetchData();
    }, []);

    return { data, isLoading, refetch: fetchData }
}

export default useAppwrite;