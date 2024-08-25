import { Answer, Question, QuestionType } from '@/pages/question/types'

const multipleChoiceMarkdown = (question: Question, index: number) => {
  const answers = question.answers
    .map((answer, index) => {
      const isCorrect = answer.isCorrect ? '*' : ''
      return `${isCorrect}${String.fromCharCode(65 + index)}. ${answer.content}`
    })
    .join('\n')
  if (question.questionLable) {
    const res = `Q${index + 1}. [${question.questionLable.name}] ${question.content}\n${answers}`
    return res
  }
  return `Q${index + 1}. ${question.content}\n${answers}`
}

const singleChoiceMarkdown = (question: Question, index: number) => {
  const answers = question.answers
    .map((answer, index) => {
      const isCorrect = answer.isCorrect ? '*' : ''
      return `${isCorrect}${String.fromCharCode(65 + index)}. ${answer.content}`
    })
    .join('\n')
  if (question.questionLable) {
    const res = `Q${index + 1}. [${question.questionLable.name}] ${question.content}\n${answers}`
    return res
  }
  const res = `Q${index + 1}. ${question.content}\n${answers}`
  return res
}

const fillBlankMarkdown = (question: Question, index: number) => {
  const content = question.content.replace(/\$_fillblank/g, '$').trim()
  let answersStr = ''
  const answers: Record<number, Answer> = {}
  question.answers.forEach((answer) => {
    const regex = /\$_\[(\d+)\]/
    const match = answer.content.match(regex)
    if (match) {
      const index = parseInt(match[1])
      answers[index] = answer
    }
  })
  for (let i = 1; i <= Object.keys(answers).length; i++) {
    const content = answers[i].content.replace(/\$_\[\d+\]/, '').trim()
    answersStr += `${i}. ${content}\n`
  }
  answersStr = answersStr
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

  const res = `Q${index + 1}. ${content}\n${answersStr}`
  return res
}

const matchingMarkdown = (question: Question, index: number) => {
  const content = JSON.parse(question.content)

  const columnA = Object.entries(content.ColumnA)
    .map(([key, value]) => `${key}. ${value}`)
    .join('\n')

  const columnB = Object.entries(content.ColumnB)
    .map(([key, value]) => `${key}. ${value}`)
    .join('\n')

  const correctMatches = question.answers
    .filter((answer) => answer.isCorrect)
    .map((answer) => answer.content)
    .join('|')

  const a = `Q${index + 1}. ${content.Question}\nCL1:\n${columnA}\n\nCL2:\n${columnB}\n\nCorrect Matches: ${correctMatches}`
  return a
}

const readingMarkdown = (question: Question, index: number) => {
  const passage = `Q${index + 1}. ${question.content}`
  const questions = question.questionPassages
    ?.map((passageQuestion, passageIndex) => {
      if (!passageQuestion.answers) {
        return ''
      }
      const answers = passageQuestion.answers
        .map((answer, answerIndex) => {
          const isCorrect = answer.isCorrect ? '*' : ''
          return `${isCorrect}${String.fromCharCode(65 + answerIndex)}. ${answer.content}`
        })
        .join('\n')
      return `Q${index + 1}.${passageIndex + 1}. ${passageQuestion.content}\n${answers}`
    })
    .join('\n\n')
  return `${passage}\n\n${questions}`
}

const writingMarkdown = (question: Question, index: number) => {
  return `Q${index + 1}. ${question.content}`
}

export const toGeoMarkdown = (question: Question, index: number) => {
  if (question.questionType === QuestionType.MultipleChoice) {
    return multipleChoiceMarkdown(question, index)
  }
  if (question.questionType === QuestionType.SingleChoice) {
    return singleChoiceMarkdown(question, index)
  }
  if (question.questionType === QuestionType.FillBlank) {
    return fillBlankMarkdown(question, index)
  }
  if (question.questionType === QuestionType.Matching) {
    return matchingMarkdown(question, index)
  }
  if (question.questionType === QuestionType.Reading) {
    return readingMarkdown(question, index)
  }
  if (question.questionType === QuestionType.Writing) {
    return writingMarkdown(question, index)
  }

  return ''
}

export const replaceMultipleNewLines = (text: string) => {
  // only one new line is allowed
  return text.replace(/\n{2,}/g, '\n')
}

export const multipleChoiceText2Html = (text: string) => {
  const questionRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=A\.|\*A\.)/
  const answerRegex = /(\*?)([A-Z])\.\s(.+)/g
  const questionMatch = text.match(questionRegex)
  if (!questionMatch) {
    return ''
  }
  let question = questionMatch[2].trim()
  question = question
    .split('\n')
    .map((item, index) => {
      if (index === 0)
        return `<p><strong style="color:blue;font-weight: bold;">Q${questionMatch[1]}.</strong> ${item}</p>`
      else return `<p>${item}</p>`
    })
    .join('')

  const answers = []
  let answerMatch
  while ((answerMatch = answerRegex.exec(text)) !== null) {
    const answer = `<p><strong style="color:#ff0000;font-weight: bold;">${answerMatch[1] ? '*' : ''}${answerMatch[2]}.</strong> ${answerMatch[3]}</p>`
    answers.push(answer)
  }
  const res = `${question}${answers.join('')}`
  return res
}

export const singleChoiceText2Html = (text: string) => {
  const questionRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=A\.|\*A\.)/
  const answerRegex = /(\*?)([A-Z])\.\s(.+)/g
  const questionMatch = text.match(questionRegex)
  if (!questionMatch) {
    return ''
  }
  let question = questionMatch[2].trim()
  question = question
    .split('\n')
    .map((item, index) => {
      if (index === 0)
        return `<p><strong style="color:blue;font-weight: bold;">Q${questionMatch[1]}.</strong> ${item}</p>`
      else return `<p>${item}</p>`
    })
    .join('')
  const answers = []
  let answerMatch
  while ((answerMatch = answerRegex.exec(text)) !== null) {
    const answer = `<p><strong style="color:#ff0000;font-weight: bold;">${answerMatch[1] ? '*' : ''}${answerMatch[2]}.</strong> ${answerMatch[3]}</p>`
    answers.push(answer)
  }
  const res = `${question}${answers.join('')}`
  return res
}

export const fillBlankText2Html = (text: string) => {
  const questionRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=\d\..*\n)/
  const answerRegex = /(\d+)\.\s(.+)/g
  const questionMatch = text.match(questionRegex)
  text = text.replace(questionRegex, '')
  if (!questionMatch) {
    return ''
  }
  let question = questionMatch[2]
  question = question.replace(/(\$\[\d+\])/g, '<span style="color:#ab2428;">$1</span>')
  question = question.trim()
  question = question
    .split('\n')
    .map((item, index) => {
      if (index === 0)
        return `<p><strong style="color:blue;font-weight: bold;">Q${questionMatch[1]}.</strong> ${item}</p>`
      else return `<p>${item}</p>`
    })
    .join('')
  const answers = []
  let answerMatch
  while ((answerMatch = answerRegex.exec(text)) !== null) {
    const answer = `<p><strong style="color:#ff0000;font-weight: bold;">${answerMatch[1]}.</strong> ${answerMatch[2]}</p>`
    answers.push(answer)
  }
  return `${question}${answers.join('')}`
}

export const matchingText2Html = (text: string) => {
  // Extract question part from text
  const questionRegex = /Q(\d+)\.\s*(.*?)(?=CL1:)/s
  const questionMatch = text.match(questionRegex)
  const question = questionMatch
    ? questionMatch[2]
        .trim()
        .split('\n')
        .map((item, index) => {
          if (index === 0)
            return `<p><strong style="color:blue;font-weight: bold;">Q${questionMatch[1]}.</strong> ${item}</p>`
          else return `<p>${item}</p>`
        })
        .join('')
    : ''

  // Extract column A and column B parts from text
  const columns1Regex = /CL1:\s*(.*?)(?=(CL2:)|$)/s
  const columns2Regex = /CL2:\s*(.*?)(?=(Correct Matches:)|$)/s
  const columns1Match = text.match(columns1Regex)
  const columns2Match = text.match(columns2Regex)

  // Extract correct matches part from text
  const matchesRegex = /Correct Matches:\s*(.*)/
  const matchesMatch = text.match(matchesRegex)
  const correctMatches = matchesMatch ? matchesMatch[1].trim() : ''

  // Format column A and column B as HTML list items
  const columnA = columns1Match
    ? columns1Match[1]
        .trim()
        .split('\n')
        .map((item) => `<p>${item}</p>`)
        .join('')
    : ''
  const columnB = columns2Match
    ? columns2Match[1]
        .trim()
        .split('\n')
        .map((item) => `<p>${item}</p>`)
        .join('')
    : ''

  // Format correct matches
  const correctMatchesHtml = correctMatches
    .split('|')
    .map((match) => `<span>${match}</span>`)
    .join(', ')

  return `
        ${question}
        <p><strong style="color:#ab2428;font-weight: bold;">CL1:</strong></p>
        ${columnA}
        <p><strong style="color:#ab2428;font-weight: bold;">CL2:</strong></p>
        ${columnB}
        <p><strong style="color:red;font-weight: bold;">Correct Matches:</strong> <span style="color:#ab2428;font-weight: bold;">${correctMatchesHtml}</span></p>
    `
}

export const readingText2Html = (text: string) => {
  const passageRegex = /Q(\d+)\.(.+?)(?=Q\d+\.\d+)/s
  const passageMatch = text.match(passageRegex)
  const passageIndex = passageMatch ? passageMatch[1] : ''
  const passage = passageMatch
    ? passageMatch[2]
        .trim()
        .split('\n')
        .map((item, index) => {
          if (index === 0)
            return `<p><strong style="color:blue;font-weight: bold;">Q${passageIndex}.</strong> ${item}</p>`
          else return `<p>${item}</p>`
        })
        .join('')
    : ''

  const questionsRegex = /Q((\d+)\.\d+)\.(.*?)(?=Q\d+\.\d+|$)/gs
  const questions = []
  let questionMatch
  while ((questionMatch = questionsRegex.exec(text)) !== null) {
    const question = questionMatch[0].trim()
    const questionRegex = /Q(\d+)\.(\d+)\.(.*?\n(?:.*\n)*?)(?=A\.|\*A\.)/
    const questionMatch2 = question.match(questionRegex)
    const index2 = questionMatch[1]
    const questionContent = questionMatch2
      ? questionMatch2[3]
          .trim()
          .split('\n')
          .map((item, index) => {
            if (index === 0)
              return `<p class="passage_q"><strong style="color:#ab2428;font-weight: bold;">Q${index2}.</strong> ${item}</p>`
            else return `<p class="passage_q">${item}</p>`
          })
          .join('')
      : ''

    const answersRegex = /(\*?)([A-Z])\.\s(.+)/g
    const answers = []
    let answerMatch
    while ((answerMatch = answersRegex.exec(questionMatch[0])) !== null) {
      const answer = `<p class="passage_q"><strong style="color:#ff0000;font-weight: bold;">${answerMatch[1] ? '*' : ''}${answerMatch[2]}.</strong> ${answerMatch[3]}</p>`
      answers.push(answer)
    }
    questions.push(`
            ${questionContent}
            ${answers.join('')}
        `)
  }

  return `
        ${passage}
        <p><br></p>
        ${questions.join('')}
    `
}

export const writingText2Html = (text: string) => {
  const questionRegex = /Q(\d+)\.(.*)/s
  const questionMatch = text.match(questionRegex)
  const index2 = questionMatch ? questionMatch[1] : ''
  const question = questionMatch
    ? questionMatch[2]
        .trim()
        .split('\n')
        .map((item, index) => {
          if (index === 0) return `<p><strong style="color:blue;font-weight: bold;">Q${index2}.</strong> ${item}</p>`
          else return `<p>${item}</p>`
        })
        .join('')
    : ''

  return `
        ${question}
    `
}

export const div2GeoMarkdown = (text: string) => {
  const singleChoiceRegex = /\[SINGLE CHOICE\]\n(.*?)(?=(\[(MULTIPLE CHOICE|FILL BLANK|MATCHING|READING|WRITING)\])|$)/s
  const multipleChoiceRegex =
    /\[MULTIPLE CHOICE\]\n(.*?)(?=(\[(SINGLE CHOICE|FILL BLANK|MATCHING|READING|WRITING)\])|$)/s
  const fillBlankRegex = /\[FILL BLANK\]\n(.*?)(?=(\[(SINGLE CHOICE|MULTIPLE CHOICE|MATCHING|READING|WRITING)\])|$)/s
  const matchingRegex = /\[MATCHING\]\n(.*?)(?=(\[(SINGLE CHOICE|MULTIPLE CHOICE|FILL BLANK|READING|WRITING)\])|$)/s
  const readingRegex = /\[READING\]\n(.*?)(?=(\[(SINGLE CHOICE|MULTIPLE CHOICE|FILL BLANK|MATCHING|WRITING)\])|$)/s
  const writingRegex = /\[WRITING\]\n(.*?)(?=(\[(SINGLE CHOICE|MULTIPLE CHOICE|FILL BLANK|MATCHING|READING)\])|$)/s

  const singleChoiceMatch = text.match(singleChoiceRegex)
  const multipleChoiceMatch = text.match(multipleChoiceRegex)
  const fillBlankMatch = text.match(fillBlankRegex)
  const matchingMatch = text.match(matchingRegex)
  const readingMatch = text.match(readingRegex)
  const writingMatch = text.match(writingRegex)

  const singleChoice = singleChoiceMatch ? singleChoiceMatch[1].trim() : ''
  const multipleChoice = multipleChoiceMatch ? multipleChoiceMatch[1].trim() : ''
  const fillBlank = fillBlankMatch ? fillBlankMatch[1].trim() : ''
  const matching = matchingMatch ? matchingMatch[1].trim() : ''
  const reading = readingMatch ? readingMatch[1].trim() : ''
  const writing = writingMatch ? writingMatch[1].trim() : ''

  return {
    singleChoice,
    multipleChoice,
    fillBlank,
    matching,
    reading,
    writing,
  }
}

export const SingleChoiceGeoMarkdown2Objects = (text: string) => {
  const questions: Question[] = []
  const singleChoiceRegex = /Q(\d+)\.(.*?)(?=Q\d+\.|$)/gs
  const matches = text.matchAll(singleChoiceRegex)
  for (const match of matches) {
    const questionRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=A\.|\*A\.)/
    const answerRegex = /(\*?)([A-Z])\.\s(.+)/g
    const questionMatch = match[0].match(questionRegex)
    if (!questionMatch) {
      continue
    }
    const question = questionMatch[2]
    const answers: Answer[] = []
    let answerMatch
    while ((answerMatch = answerRegex.exec(match[0])) !== null) {
      const isCorrect = answerMatch[1] ? true : false
      const content = answerMatch[3]
      const answer = { id: '', content, questionId: '', isCorrect }
      answers.push(answer)
    }

    // only one first answer is correct, else set to false
    let firstCorrect = true
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].isCorrect && firstCorrect) {
        firstCorrect = false
      } else {
        answers[i].isCorrect = false
      }
    }

    const q: Question = {
      content: question,
      answers,
      questionType: QuestionType.SingleChoice,
      rawIndex: parseInt(questionMatch[1]),
    }
    questions.push(q)
  }
  return questions
}

export const MultipleChoiceGeoMarkdown2Objects = (text: string) => {
  const questions: Question[] = []
  const multipleChoiceRegex = /Q(\d+)\.(.*?)(?=Q\d+\.|$)/gs
  const matches = text.matchAll(multipleChoiceRegex)
  for (const match of matches) {
    const questionRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=A\.|\*A\.)/
    const answerRegex = /(\*?)([A-Z])\.\s(.+)/g
    const questionMatch = match[0].match(questionRegex)
    if (!questionMatch) {
      continue
    }
    const question = questionMatch[2]
    const answers: Answer[] = []
    let answerMatch
    while ((answerMatch = answerRegex.exec(match[0])) !== null) {
      const isCorrect = answerMatch[1] ? true : false
      const content = answerMatch[3]
      const answer = { id: '', content, questionId: '', isCorrect }
      answers.push(answer)
    }
    const q: Question = {
      content: question,
      answers,
      questionType: QuestionType.MultipleChoice,
      rawIndex: parseInt(questionMatch[1]),
    }
    questions.push(q)
  }
  return questions
}

export const FillBlankGeoMarkdown2Objects = (text: string) => {
  const questions: Question[] = []
  const fillBlankRegex = /Q(\d+)\.(.*?)(?=Q\d+\.|$)/gs
  const matches = text.matchAll(fillBlankRegex)
  for (const match of matches) {
    const questionRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=\d\..*\n)/s
    const answerRegex = /(\d+)\.\s(.+)/g
    const questionMatch = match[0].match(questionRegex)
    if (!questionMatch) {
      continue
    }
    let answersStr = match[0]
    answersStr = answersStr.replace(questionRegex, '')
    let question = questionMatch[2]
    const answers: Answer[] = []
    let answerMatch
    while ((answerMatch = answerRegex.exec(answersStr)) !== null) {
      const content = answerMatch[2]
      const answer = { id: '', content, questionId: '', isCorrect: true }
      answers.push(answer)
    }
    for (let i = 0; i < answers.length; i++) {
      answers[i].content = `$_[${i + 1}]${answers[i].content}`
    }

    question = question.replace(/\$\[(\d+)\]/g, '$_fillblank[$1]')

    const q: Question = {
      content: question,
      answers,
      questionType: QuestionType.FillBlank,
      rawIndex: parseInt(questionMatch[1]),
    }

    questions.push(q)
  }
  return questions
}

export const MatchingGeoMarkdown2Objects = (text: string) => {
  const questions: Question[] = []
  const matchingRegex = /Q(\d+)\.(.*?)(?=Q\d+\.|$)/gs
  const matches = text.matchAll(matchingRegex)
  for (const match of matches) {
    const questionRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=Correct Matches:)/s
    const questionMatch = match[0].match(questionRegex)
    if (!questionMatch) {
      continue
    }
    const questionContentRegex = /Q(\d+)\.(.*?\n(?:.*\n)*?)(?=CL1:|$)/s
    const questionContentMatch = match[0].match(questionContentRegex)

    const question = questionMatch[2]
    const answers: Answer[] = []
    const columns1Regex = /CL1:\s*(.*?)(?=(CL2:)|$)/s
    const columns2Regex = /CL2:\s*(.*?)(?=(Correct Matches:)|$)/s
    const columns1Match = question.match(columns1Regex)
    const columns2Match = question.match(columns2Regex)

    const column1 = columns1Match ? columns1Match[1].trim() : ''
    const column2 = columns2Match ? columns2Match[1].trim() : ''

    const correctMatchesRegex = /Correct Matches:\s*(.*)/
    const correctMatchesMatch = text.match(correctMatchesRegex)
    let correctMatches = correctMatchesMatch ? correctMatchesMatch[1].trim() : ''
    const correctMatchesArr = correctMatches.split(',')
    for (let i = 0; i < correctMatchesArr.length; i++) {
      correctMatchesArr[i] = correctMatchesArr[i].trim()
    }

    const column1Items = column1.split('\n')
    const column2Items = column2.split('\n')

    const columnA: Record<string, string> = {}
    for (let i = 0; i < column1Items.length; i++) {
      const regex = /(\d+)\.\s(.+)/
      const match = column1Items[i].match(regex)
      if (match) {
        columnA[match[1]] = match[2]
      }
    }

    const columnB: Record<string, string> = {}
    for (let i = 0; i < column2Items.length; i++) {
      // regex to extract number and text
      const regex = /(\d+)\.\s(.+)/
      const match = column2Items[i].match(regex)
      if (match) {
        columnB[match[1]] = match[2]
      }
    }

    // Check correct matches
    // Check valid correct matches
    for (let i = 0; i < correctMatchesArr.length; i++) {
      const match = correctMatchesArr[i].split('_')
      const keyA = match[0]
      const keyB = match[1]

      // Check if keyA and keyB are valid
      if (!columnA[keyA] || !columnB[keyB]) {
        // remove invalid correct matches
        correctMatchesArr.splice(i, 1)
      }

      // check if keyA matches more than one keyB
      // or keyB matches more than one keyA
      let count = 0
      for (let j = 0; j < correctMatchesArr.length; j++) {
        const match = correctMatchesArr[j].split('_')
        if (keyA === match[0] || keyB === match[1]) {
          count++
        }
      }
      if (count > 1) {
        correctMatchesArr.splice(i, 1)
      }
    }
    correctMatches = correctMatchesArr.join('|')

    answers.push({ id: '', content: correctMatches, questionId: '', isCorrect: true })
    const content = {
      Question: questionContentMatch ? questionContentMatch[2] || '' : '',
      ColumnA: columnA,
      ColumnB: columnB,
    }

    const q: Question = {
      content: JSON.stringify(content),
      answers,
      questionType: QuestionType.Matching,
      rawIndex: parseInt(questionMatch[1]),
    }

    questions.push(q)
  }
  return questions
}

export const ReadingGeoMarkdown2Objects = (text: string) => {
  const questions: Question[] = []
  const readingRegex = /Q(\d+)\.(.*?)(?=Q\d+\.\s|$)/gs
  const matches = text.matchAll(readingRegex)
  for (const match of matches) {
    const questionRegex = /Q(\d+)\.(.*?)(?=(Q\d+\.\d+\.)|$)/s
    const questionMatch = match[0].match(questionRegex)

    if (!questionMatch) {
      continue
    }

    const passage = questionMatch[2].trim()

    const questionPassages: any[] = []

    const passageQuestionsRegex = /Q(\d+)\.(\d+)\.(.*?)(?=(Q\d+\.\d+\.)|$)/gs
    let passageQuestionMatch

    while ((passageQuestionMatch = passageQuestionsRegex.exec(match[0])) !== null) {
      const questionContentRegex = /Q(\d+)\.(\d+)\.(.*?\n(?:.*\n)*?)(?=A\.|\*A\.)/
      const questionContentMatch = passageQuestionMatch[0].match(questionContentRegex)
      const question = questionContentMatch ? questionContentMatch[3].trim() : ''

      const answersRegex = /(\*?)([A-Z])\.\s(.+)/g
      const answers: Answer[] = []
      let answerMatch
      while ((answerMatch = answersRegex.exec(passageQuestionMatch[0])) !== null) {
        const isCorrect = answerMatch[1] ? true : false
        const content = answerMatch[3]
        const answer = { id: '', content, questionId: '', isCorrect }
        answers.push(answer)
      }

      const q: any = {
        content: question,
        answers,
        questionType: QuestionType.SingleChoice,
        index: parseInt(passageQuestionMatch[2]),
      }

      questionPassages.push(q)
    }

    const q: Question = {
      content: passage,
      questionPassages,
      questionType: QuestionType.Reading,
      rawIndex: parseInt(questionMatch[1]),
      answers: [],
    }

    questions.push(q)
  }

  return questions
}

export const WritingGeoMarkdown2Objects = (text: string) => {
  const questions: Question[] = []
  const writingRegex = /Q(\d+)\.(.*?)(?=Q\d+\.\s|$)/gs
  const matches = text.matchAll(writingRegex)
  for (const match of matches) {
    const questionRegex = /Q(\d+)\.(.*)/s
    const questionMatch = match[0].match(questionRegex)
    if (!questionMatch) {
      continue
    }
    const question = questionMatch[2].trim()
    const q: Question = {
      content: question,
      answers: [],
      questionType: QuestionType.Writing,
      rawIndex: parseInt(questionMatch[1]),
    }
    questions.push(q)
  }
  return questions
}

export const GeoMarkdown2Objects = (text: string) => {
  const { singleChoice, multipleChoice, fillBlank, matching, reading, writing } = div2GeoMarkdown(text)
  const questions: Question[] = []

  // Single Choice
  const singleChoiceQuestions = SingleChoiceGeoMarkdown2Objects(singleChoice)
  questions.push(...singleChoiceQuestions)

  // Multiple Choice
  const multipleChoiceQuestions = MultipleChoiceGeoMarkdown2Objects(multipleChoice)
  questions.push(...multipleChoiceQuestions)

  // Fill Blank
  const fillBlankQuestions = FillBlankGeoMarkdown2Objects(fillBlank)
  questions.push(...fillBlankQuestions)

  // Matching
  const matchingQuestions = MatchingGeoMarkdown2Objects(matching)
  questions.push(...matchingQuestions)

  // Reading
  const readingQuestions = ReadingGeoMarkdown2Objects(reading)
  questions.push(...readingQuestions)

  // Writing
  const writingQuestions = WritingGeoMarkdown2Objects(writing)
  questions.push(...writingQuestions)

  return questions
}
