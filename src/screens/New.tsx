import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton, CheckBox } from '../components'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { api } from "../lib";

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']
 
export function New ()  {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter((weekDay) => weekDay !== weekDayIndex))
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        return Alert.alert('Informe o nome do hábito e escolha a periodicidade')
      }

      await api.post('habits', {
        title,
        weekDays
      })

      setTitle('')
      setWeekDays([])

      Alert.alert('Novo hábito', 'Novo hábito criado com sucesso')
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível criar o novo hábito')
      console.log(error)
    }
  }

  return (  
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>
        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu completimento?
        </Text>
        <TextInput 
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="ex.: Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual seu completimento?
        </Text>
        {availableWeekDays.map((weekDay, index) => (
          <CheckBox 
            key={weekDay} 
            title={weekDay} 
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleCreateNewHabit}
        className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
      >
        <Feather
          name='check'
          size={20}
          color={colors.white}
        />
        <Text
          className="font-semibold text-base text-white ml-2"
        >
          Confirmar
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
