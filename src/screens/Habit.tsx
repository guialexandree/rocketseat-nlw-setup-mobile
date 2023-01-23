import { useEffect, useState } from 'react'
import { ScrollView, View, Text, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { BackButton, CheckBox, HabitsEmpty, ProgressBar } from '../components'
import dayjs from 'dayjs'
import { api } from '../lib'
import { generateProgressPercentage } from '../utils'
import clsx from 'clsx'

type HabitParams = {
  date: string
}

type DayInfoProps = {
  completedHabits: string[]
  possibleHabits: Array<{
    id: string
    title: string
  }>
}

export function Habit ()  {
  const [loading, setLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute()
  const { date } = route.params as HabitParams

  const parsedDate = dayjs(date)
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  const habitsProgress = dayInfo?.possibleHabits 
    ? generateProgressPercentage(dayInfo?.possibleHabits.length, completedHabits.length) 
    : 0

  async function fetchHabits() {
    try {
      setLoading(true)

      const response = await api.get('day', { params: { date }})
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
      
    } catch (error) {
      Alert.alert('Ops!', 'Não foi possível carregar as informações dos hábitos')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle`)
      if (completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
      } else {
        setCompletedHabits(prevState => [...prevState, habitId])
      }
    } catch (error) {
      Alert.alert('Ops!', 'Não foi possível atualizar o status do hábito')
      console.log(error)
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  return (  
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className='mt-6 text-zinc-400 font-semibold text-base lowercase'>
          {dayOfWeek}
        </Text>
        <Text className='text-white font-extrabold text-3xl'>
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx('mt-6', {
          ['opacity-50']: isDateInPast
        }) }>
          {
            dayInfo?.possibleHabits.length ?
              dayInfo?.possibleHabits.map(habit => (
                <CheckBox 
                  key={habit.id} 
                  title={habit.title} 
                  checked={completedHabits.includes(habit.id)} 
                  onPress={() => handleToggleHabit(habit.id)}
                  disabled={isDateInPast}
                />
              ))
              : <HabitsEmpty />
          }
        </View>

        {
          isDateInPast && (
            <Text className='text-white mt-10 text-center'>
              Você não pode mudar uma data passada
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}
