import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type Step = 'invite' | 'food' | 'date' | 'arriving' | 'done'
type Food = {
  id: string
  emoji: string
  name: string
  accent: string
  position: string
  rotate: string
}

const introLines = [
  '해원아, 있잖아... 혹시...',
  '나랑 데이트 할래?',
]

const foods: Food[] = [
  {
    id: 'sushi',
    emoji: '🍣',
    name: '초밥',
    accent: 'from-rose-200 to-orange-100',
    position: 'left-1 top-6',
    rotate: '0deg',
  },
  {
    id: 'pasta',
    emoji: '🍝',
    name: '파스타',
    accent: 'from-amber-200 to-yellow-100',
    position: 'right-2 top-8',
    rotate: '90deg',
  },
  {
    id: 'tteokbokki',
    emoji: '🌶️',
    name: '떡볶이',
    accent: 'from-red-200 to-orange-200',
    position: 'left-0 top-[8.5rem]',
    rotate: '-35deg',
  },
  {
    id: 'samgyeopsal',
    emoji: '🥓',
    name: '삼겹살',
    accent: 'from-orange-200 to-amber-100',
    position: 'right-0 top-[9rem]',
    rotate: '125deg',
  },
  {
    id: 'malatang',
    emoji: '🍲',
    name: '마라탕',
    accent: 'left-8 bottom-8 from-pink-200 to-rose-100',
    position: 'left-8 bottom-[40%]',
    rotate: '-90deg',
  },
  {
    id: 'bingsu',
    emoji: '🍧',
    name: '빙수',
    accent: 'right-8 bottom-10 from-sky-200 to-cyan-100',
    position: 'right-8 bottom-[40%]',
    rotate: '180deg',
  },
]

const imageAssets = [
  '/younghoon-happy.png',
  '/younghoon-food.png',
  '/younghoon-crying.png',
  '/younghoon-coat.png',
  '/paris.png',
  '/teardrop.svg',
  '/thought-bubble.svg',
]

function formatDateTime(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][
    new Date(year, month - 1, day).getDay()
  ]
  const [hour, minute] = timeStr.split(':').map(Number)
  const period = hour < 12 ? '오전' : '오후'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${year}년 ${month}월 ${day}일 (${weekday}) ${period} ${hour12}:${String(
    minute,
  ).padStart(2, '0')}`
}

function useTypewriter(
  lines: string[],
  { charDelay = 70, lineDelay = 550 }: { charDelay?: number; lineDelay?: number } = {},
) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const current = lines[lineIndex] ?? ''

    if (charCount < current.length) {
      const timer = window.setTimeout(() => setCharCount((c) => c + 1), charDelay)
      return () => window.clearTimeout(timer)
    }

    if (lineIndex < lines.length - 1) {
      const timer = window.setTimeout(() => {
        setLineIndex((i) => i + 1)
        setCharCount(0)
      }, lineDelay)
      return () => window.clearTimeout(timer)
    }
  }, [lines, lineIndex, charCount, charDelay, lineDelay])

  return { lineIndex, text: (lines[lineIndex] ?? '').slice(0, charCount) }
}

function Tear({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.img
      src="/teardrop.svg"
      alt=""
      aria-hidden
      className={`pointer-events-none absolute top-[25%] z-10 w-4 -translate-x-1/2 drop-shadow ${className ?? ''}`}
      initial={{ y: 0, opacity: 0, scale: 0.6 }}
      animate={{
        y: ['0%', '10%', '360%'],
        opacity: [0, 1, 1, 0],
        scale: [0.6, 1, 1, 0.9],
      }}
      transition={{
        duration: 2.2,
        delay,
        times: [0, 0.15, 0.85, 1],
        ease: 'easeIn',
        repeat: Infinity,
        repeatDelay: 0.4,
      }}
    />
  )
}

function App() {
  const [step, setStep] = useState<Step>('invite')
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  useEffect(() => {
    imageAssets.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <main className="h-[100svh] overflow-y-auto bg-[radial-gradient(circle_at_top,_#fff8f4,_#ffd7d0_45%,_#ffebe6_72%,_#fff7f2)] px-3 py-3 text-stone-800">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-sm flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(166,77,53,0.18)] backdrop-blur">


        <div className="flex min-h-0 flex-1 flex-col">

          <div className="flex min-h-0 flex-1 flex-col px-4 pb-3">
            <AnimatePresence mode="wait">
              {step === 'invite' && (
                <InviteStep
                  key="invite"
                  onAccept={() => setStep('food')}
                  onReject={() => setIsRejectModalOpen(true)}
                />
              )}
              {step === 'food' && (
                <FoodStep
                  key="food"
                  selectedFood={selectedFood}
                  onBack={() => setStep('invite')}
                  onSelect={setSelectedFood}
                  onNext={() => setStep('date')}
                />
              )}
              {step === 'date' && (
                <DateStep
                  key="date"
                  selectedDate={selectedDate}
                  onBack={() => setStep('food')}
                  onSelect={setSelectedDate}
                  onNext={() => setStep('arriving')}
                />
              )}
              {step === 'arriving' && (
                <ArrivingStep key="arriving" onDone={() => setStep('done')} />
              )}
              {step === 'done' && selectedFood && selectedDate && (
                <DoneStep
                  key="done"
                  selectedDate={selectedDate}
                  selectedFood={selectedFood.name}
                  onBack={() => setStep('date')}
                  onRestart={() => {
                    setStep('invite')
                    setSelectedFood(null)
                    setSelectedDate(null)
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isRejectModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-xs overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
              initial={{ y: 24, scale: 0.94 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.94 }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-sky-50">
                <img
                  src="/younghoon-crying.png"
                  alt="울고 있는 영훈"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />

                {/* 양쪽 눈에서 흘러내리는 눈물 */}
                <Tear className="left-[31%]" delay={0} />
                <Tear className="left-[31%]" delay={1.1} />
                <Tear className="left-[60%]" delay={0.55} />
                <Tear className="left-[60%]" delay={1.65} />

                {/* 사진 위에 오버레이된 대사창 */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent px-4 pb-4 pt-12">
                  <div className="rounded-[1.25rem] bg-white/70 px-4 py-3 text-center shadow-lg backdrop-blur-md">
                    <p className="text-lg font-semibold text-sky-950">
                      진짜? 나랑 안 놀꺼야?ㅠㅜㅠ
                    </p>

                  </div>
                </div>
              </div>

              <div className="p-4">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="w-full rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
                >
                  다시 생각해볼까..?
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function InviteStep({
  onAccept,
  onReject,
}: {
  onAccept: () => void
  onReject: () => void
}) {
  const typed = useTypewriter(introLines)

  return (
    <motion.section
      className="flex min-h-0 flex-1 flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
    >


      <div className="relative mt-1 min-h-0 flex-1 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,_#ffe7de,_#fff5ee)] shadow-inner">
        <img
          src="/younghoon-happy.png"
          alt="꽃다발을 들고 있는 영훈"
          className="h-full min-h-0 w-full object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/25 to-transparent px-3 pb-4 pt-10">
          {introLines.map((line, index) => {
            const isVisible = index <= typed.lineIndex

            if (!isVisible) return null

            const text =
              index < typed.lineIndex ? line : typed.text
            const isTyping =
              index === typed.lineIndex && text.length < line.length

            return (
              <motion.div
                key={line}
                className="font-display max-w-[92%] rounded-[1.4rem] rounded-tl-sm bg-white/65 px-4 py-2.5 text-[1.12rem] leading-5 text-stone-800 shadow-[0_10px_30px_rgba(206,107,84,0.18)] backdrop-blur-md"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                {text}
                {isTyping && (
                  <span className="ml-0.5 inline-block h-[1.05em] w-[2px] -translate-y-[1px] animate-pulse bg-stone-500 align-middle" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <button
          type="button"
          onClick={onAccept}
          className="w-full rounded-full bg-stone-900 px-4 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_rgba(41,25,21,0.24)] transition active:scale-[0.98]"
        >
          수락할래
        </button>
        <button
          type="button"
          onClick={onReject}
          className="w-full rounded-full border border-rose-200 bg-rose-50 px-4 py-3.5 text-base font-semibold text-rose-500 transition active:scale-[0.98]"
        >
          거절할래
        </button>
      </div>
    </motion.section>
  )
}

function FoodStep({
  selectedFood,
  onBack,
  onSelect,
  onNext,
}: {
  selectedFood: Food | null
  onBack: () => void
  onSelect: (food: Food | null) => void
  onNext: () => void
}) {
  const [custom, setCustom] = useState('')

  const handleCustomChange = (value: string) => {
    setCustom(value)
    const trimmed = value.trim()
    if (trimmed) {
      onSelect({
        id: 'custom',
        emoji: '✨',
        name: trimmed,
        accent: '',
        position: '',
        rotate: '0deg',
      })
    }
  }

  return (
    <motion.section
      className="flex min-h-0 flex-1 flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative mt-1 min-h-0 flex-1 overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,_#fff,_#ffe9df_45%,_#ffd7ca)]">
        <img
          src="/younghoon-food.png"
          alt="데이트를 기대하는 영훈"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {foods.map((food) => {
          const isSelected = selectedFood?.id === food.id

          return (
            <motion.button
              key={food.id}
              type="button"
              onClick={() => onSelect(isSelected ? null : food)}
              whileTap={{ scale: 0.94 }}
              animate={isSelected ? { scale: 1.12, y: -4 } : { scale: 1, y: 0 }}
              className={`absolute ${food.position} h-30 w-30 transition ${isSelected ? 'drop-shadow-[0_8px_16px_rgba(227,120,98,0.45)]' : ''
                }`}
            >
              {/* 꼬리가 얼굴을 향하도록 회전하는 말풍선 배경 */}
              <img
                src="/thought-bubble.svg"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full"
                style={{ transform: `rotate(${food.rotate})` }}
              />
              {/* 내용은 회전하지 않고 항상 정방향 */}
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl transition ${isSelected ? 'scale-110' : ''}`}>
                  {food.emoji}
                </span>
                <span
                  className={`mt-0.5 text-xs font-bold ${isSelected ? 'text-rose-500' : 'text-stone-800'
                    }`}
                >
                  {food.name}
                </span>
              </span>
            </motion.button>
          )
        })}

        {/* 사진 하단 오버레이 입력창 */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-3 pb-3 pt-10">
          <input
            type="text"
            value={custom}
            onChange={(event) => handleCustomChange(event.target.value)}
            placeholder="다른 거 먹기"
            className="w-full rounded-full border border-white/60 bg-white/85 px-4 py-3 text-sm font-medium text-stone-800 shadow-lg outline-none backdrop-blur-md placeholder:text-stone-400 focus:border-rose-300 focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600"
        >
          이전
        </button>
        <button
          type="button"
          disabled={!selectedFood}
          onClick={onNext}
          className="flex-[1.3] rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {selectedFood ? `${selectedFood.name} 먹으러 가기` : '메뉴를 골라줘'}
        </button>
      </div>
    </motion.section>
  )
}

function DateStep({
  selectedDate,
  onBack,
  onSelect,
  onNext,
}: {
  selectedDate: string | null
  onBack: () => void
  onSelect: (date: string) => void
  onNext: () => void
}) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const commit = (nextDate: string, nextTime: string) => {
    onSelect(nextDate && nextTime ? formatDateTime(nextDate, nextTime) : '')
  }

  return (
    <motion.section
      className="flex min-h-0 flex-1 flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        <p className="text-center text-xl font-semibold text-stone-900">
          우리 언제 볼까?
        </p>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-stone-700">
            날짜
          </span>
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              commit(event.target.value, time)
            }}
            className="w-full rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3.5 text-base font-medium text-stone-900 outline-none focus:border-rose-300"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-stone-700">
            시간
          </span>
          <input
            type="time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value)
              commit(date, event.target.value)
            }}
            className="w-full rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3.5 text-base font-medium text-stone-900 outline-none focus:border-rose-300"
          />
        </label>

        {selectedDate && (
          <div className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-500">
            {selectedDate}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600"
        >
          이전
        </button>
        <button
          type="button"
          disabled={!selectedDate}
          onClick={onNext}
          className="flex-[1.3] rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          확정하기
        </button>
      </div>
    </motion.section>
  )
}

function ArrivingStep({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 3400)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <motion.section
      className="flex min-h-0 flex-1 flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative mt-1 min-h-0 flex-1 overflow-hidden rounded-[1.75rem] bg-stone-900">
        {/* 배경 사진: 크게 깔고 살짝 흐리게 */}
        <img
          src="/paris.png"
          alt="파리 거리 배경"
          className="absolute inset-0 h-full w-full scale-110 object-cover object-top brightness-[0.65] blur-[1px]"
        />

        {/* 다가오는 영훈: 좌우로 살짝 회전하며 점점 커짐 */}
        <motion.img
          src="/younghoon-coat.png"
          alt="달려오는 영훈"
          className="absolute bottom-0 left-1/2 h-[78%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
          initial={{ scale: 0.55, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0.55, 0.7, 0.85, 1.02, 1.12],
            rotate: [0, -4, 4, -3, 0],
            opacity: [0, 1, 1, 1, 1],
          }}
          transition={{
            duration: 3,
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />

        {/* 사진 하단 오버레이 멘트 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-5 pt-14">
          <motion.p
            className="text-center text-base font-semibold text-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          >
            영훈이가 기쁜 마음으로 달려가는 중...
          </motion.p>
        </div>
      </div>
    </motion.section>
  )
}

function DoneStep({
  selectedDate,
  selectedFood,
  onBack,
  onRestart,
}: {
  selectedDate: string
  selectedFood: string
  onBack: () => void
  onRestart: () => void
}) {
  const dateTimeMatch = selectedDate.match(/^(.*?)\s*((?:오전|오후)\s*\d{1,2}:\d{2})$/)
  const datePart = dateTimeMatch ? dateTimeMatch[1] : selectedDate
  const timePart = dateTimeMatch ? dateTimeMatch[2] : ''

  return (
    <motion.section
      className="flex min-h-0 flex-1 flex-col justify-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
    >
      <div className="rounded-[2rem] bg-[linear-gradient(180deg,_#fffdfc,_#ffe2d7)] p-4 text-center shadow-[0_18px_40px_rgba(180,97,74,0.14)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow">
          💌
        </div>

        <p className="mt-3 text-sm font-semibold text-rose-500">
          {datePart}
          {timePart && <span className="mx-1">·</span>}
          {timePart}
        </p>

        <h2 className="mt-1.5 text-[1.7rem] font-semibold leading-tight text-stone-900">
          만나서 {selectedFood} 먹고
          <br />
          재밌게 놀자!
        </h2>

        <div className="mt-4 rounded-[1.4rem] bg-white/75 px-4 py-3 text-left text-sm leading-5 text-stone-700">
          <p>선택한 메뉴: {selectedFood}</p>
          <p>선택한 날짜: {selectedDate}</p>
          <p>상태: 해원의 수락으로 영훈이 매우 행복함</p>
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-3.5 text-sm font-semibold text-stone-600"
        >
          이전으로
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="flex-[1.3] rounded-full bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white"
        >
          처음부터 다시 보기
        </button>
      </div>
    </motion.section>
  )
}

export default App
