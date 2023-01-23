import { useState, useCallback } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { HabitDay, Header, Loading, DAY_SIZE } from '../components'
import { generateDatesFromYearBeginning } from '../utils'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { api } from '../lib'
import dayjs from 'dayjs'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const dataFromYearStart = generateDatesFromYearBeginning()
const minimiunSumMaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimiunSumMaryDatesSizes - dataFromYearStart.length

type SummaryProps = Array<{
  id: string
  date: string
  amount: number
  completed: number
}>

export function Home (){
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryProps | null>(null)

  async function fetchData() {
    try {
      setLoading(true)

      const response = await api.get('summary')
      setSummary(response.data)
    } catch (error) {
      Alert.alert('Ops!', 'Não foi possível carregar o sumário de hábitos')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchData()
  }, []))

  if (loading) {
    return (<Loading />)
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className='flex-row mt-6 mb-2'>
        {weekDays.map((weekDay, i) => (
          <Text 
            key={`${weekDay}-${i}`}
            className='text-zinc-400 text-xl font-bold text-center mx-1'
            style={{ width: DAY_SIZE }}
          >{weekDay}</Text>
        ))}
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        { summary && 
          <View className='flex-row flex-wrap'>
            {dataFromYearStart.map((date) => {
              const dayWithHabits = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day')
              })

              return (
                <HabitDay 
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  key={date.toISOString()}
                  onPress={() => navigate('habit', { date: date.toISOString() })}
                />
              )
            })}
            {amountOfDaysToFill > 0 && Array
              .from({ length: amountOfDaysToFill })
              .map((_, index) => (
                <View 
                  key={index}
                  className="bg-zinc-900 rounded-lg opacity-40 border-2 m-1 border-zinc-800"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }} 
                />
            ))}
          </View>
        }
      </ScrollView>
    </View>
  )
}
