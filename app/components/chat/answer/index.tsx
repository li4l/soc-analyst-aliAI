'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, MessageRating, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Tooltip from '@/app/components/base/tooltip'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import { randomString } from '@/utils/string'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import s from '../style.module.css'
import Thought from '../thought'
function OperationBtn({ innerContent, onClick, className }: { innerContent: React.ReactNode, onClick?: () => void, className?: string }) {
 return (
<div
     className={`relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-[#0f172a] border border-slate-700 cursor-pointer text-gray-400 hover:text-white ${className ?? ''}`}
     style={{ boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
     onClick={onClick && onClick}
>
     {innerContent}
</div>
 )
}
const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
 return isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />
}
const IconWrapper: FC<{ children: React.ReactNode | string }> = ({ children }) => {
 return (
<div className="rounded-lg h-6 w-6 flex items-center justify-center hover:bg-slate-800">
     {children}
</div>
 )
}
interface IAnswerProps {
 item: ChatItem
 feedbackDisabled: boolean
 onFeedback?: FeedbackFunc
 isResponding?: boolean
 allToolIcons?: Record<string, string | Emoji>
 suggestionClick?: (suggestion: string) => void
}
const Answer: FC<IAnswerProps> = ({
 item,
 feedbackDisabled = false,
 onFeedback,
 isResponding,
 allToolIcons,
 suggestionClick = () => { },
}) => {
 const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [] } = item
 const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0
 const { t } = useTranslation()
 const renderFeedbackRating = (rating: MessageRating | undefined) => {
   if (!rating) { return null }
   const isLike = rating === 'like'
   const ratingIconClassname = isLike ? 'text-primary-400 bg-primary-900/30' : 'text-red-400 bg-red-900/30'
   return (
<Tooltip
       selector={`user-feedback-${randomString(16)}`}
       content={isLike ? 'Cancel Like' : 'Cancel Dislike'}
>
<div
         className="relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-[#0f172a] border border-slate-700 cursor-pointer text-gray-400"
         onClick={async () => {
           await onFeedback?.(id, { rating: null })
         }}
>
<div className={`${ratingIconClassname} rounded-lg h-6 w-6 flex items-center justify-center`}>
<RatingIcon isLike={isLike} />
</div>
</div>
</Tooltip>
   )
 }
 const renderItemOperation = () => {
   const userOperation = () => {
     return feedback?.rating
       ? null
       : (
<div className="flex gap-1">
<Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.like') as string}>
             {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={true} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'like' }) })}
</Tooltip>
<Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.dislike') as string}>
             {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={false} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'dislike' }) })}
</Tooltip>
</div>
       )
   }
   return (
<div className={`${s.itemOperation} flex gap-2`}>
       {userOperation()}
</div>
   )
 }
 const getImgs = (list?: VisionFile[]) => {
   if (!list) { return [] }
   return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
 }
 const agentModeAnswer = (
<div className="text-slate-100">
     {agent_thoughts?.map((item, index) => (
<div key={index}>
         {item.thought && (
<StreamdownMarkdown content={item.thought} />
         )}
         {!!item.tool && (
<Thought
             thought={item}
             allToolIcons={allToolIcons || {}}
             isFinished={!!item.observation || !isResponding}
           />
         )}
         {getImgs(item.message_files).length > 0 && (
<ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
         )}
</div>
     ))}
</div>
 )
 return (
<div key={id}>
<div className="flex items-start">
<div className={`${s.answerIcon} w-10 h-10 shrink-0 flex items-center justify-center`}>
<img
           src="/logo.png"
           className="w-8 h-8 rounded-lg object-contain bg-white p-1 shadow-sm"
           alt="Ali SOC"
         />
</div>
<div className={`${s.answerWrap} max-w-[calc(100%-3rem)]`}>
<div className={`${s.answer} relative text-sm text-slate-100`}>
<div className={`ml-2 py-3 px-4 bg-[#1e293b] border border-slate-700/50 shadow-sm rounded-tr-2xl rounded-b-2xl ${workflowProcess && 'min-w-[480px]'}`}>
             {workflowProcess && (
<WorkflowProcess data={workflowProcess} hideInfo />
             )}
             {(isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(item => !!item.thought || !!item.tool).length === 0) : !content))
               ? (
<div className="flex items-center justify-center w-6 h-5">
<LoadingAnim type="text" />
</div>
               )
               : (isAgentMode
                 ? agentModeAnswer
                 : (
<StreamdownMarkdown content={content} />
                 ))}
             {suggestedQuestions.length > 0 && (
<div className="mt-3">
<div className="flex gap-1 mt-1 flex-wrap">
                   {suggestedQuestions.map((suggestion, index) => (
<div key={index} className="flex items-center gap-1">
<Button className="text-xs text-blue-400 hover:text-blue-300" type="link" onClick={() => suggestionClick(suggestion)}>{suggestion}</Button>
</div>
                   ))}
</div>
</div>
             )}
</div>
<div className="absolute top-[-14px] right-[-14px] flex flex-row justify-end gap-1">
             {!feedbackDisabled && !item.feedbackDisabled && renderItemOperation()}
             {!feedbackDisabled && renderFeedbackRating(feedback?.rating)}
</div>
</div>
</div>
</div>
</div>
 )
}
export default React.memo(Answer)
