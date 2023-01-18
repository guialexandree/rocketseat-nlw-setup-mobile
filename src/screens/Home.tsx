import { View, Text, ScrollView } from 'react-native'
import { HabitDay, Header, DAY_SIZE } from '../components'
import { generateDatesFromYearBeginning } from '../utils'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const dataFromYearStart = generateDatesFromYearBeginning()
const minimiunSumMaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimiunSumMaryDatesSizes - dataFromYearStart.length

export function Home (){
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
        <View className='flex-row flex-wrap'>
          {dataFromYearStart.map((date) => (
            <HabitDay key={date.toISOString()}/>
          ))}
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
      </ScrollView>
    </View>
  )
}
