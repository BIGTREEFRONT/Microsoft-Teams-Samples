import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { Flex, Menu, Button, Text } from '@fluentui/react-northstar'
import "../recruiting-details/recruiting-details.css"
import BasicDetails from "./basic-details/basic-details"
import Timeline from "./basic-details/timeline"
import Notes from "./basic-details/notes"
import QuestionsMobile from './questions/questions-mobile';
import BasicDetailsMobile from './basic-details/basic-details-mobile';
import Questions from './basic-details/questions';
import { getQuestions, saveFeedback } from "./services/recruiting-detail.service";
import { IQuestionDetails } from '../../types/recruitment.types';

const RecruitingDetails = () => {
    const mobileMenuItems = [
        {
            key: 'overview',
            content: 'Overview',
        },
        {
            key: 'questions',
            content: 'Questions',
        }
    ];

    const [activeMobileMenu, setActiveMobileMenu] = React.useState(0);
    const [questionDetails, setQuestionDetails] = React.useState<IQuestionDetails[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [currentCandidateEmail, setCurrentCandidateEmail] = React.useState<string>('');

    const setSelectedCandidateIndex = (index: number, email: string) => {
        setSelectedIndex(index);
        debugger
        setCurrentCandidateEmail(email);
    }

    // Method to set the rating for a question.
    const setRating = (event: any) => {
        const currentQuestions = [...questionDetails];
        const questToUpdate = currentQuestions.find(quest => quest.rowKey == event.currentTarget.id)!;
        questToUpdate.rating = event.target.innerText;
        setQuestionDetails(currentQuestions);
    }

    // Method to set comment on a question.
    const saveComment = (rowKey: string) => {
        const currentQuestions = [...questionDetails];
        const questToUpdate = currentQuestions.find(quest => quest.rowKey == rowKey)!;
        const doc: any = document.getElementById(rowKey + "_textarea");
        questToUpdate.comment = doc.value;
        setQuestionDetails(currentQuestions);
    }

    const setShowAddComment = (rowKey: string, isShow: boolean) => {
        const currentQuestions = [...questionDetails];
        const questToUpdate = currentQuestions.find(quest => quest.rowKey == rowKey)!;
        questToUpdate.showAddComment = isShow ? true: false;
        setQuestionDetails(currentQuestions);
    }

    // Method to load the questions in the question container.
    const loadQuestions = () => {
        microsoftTeams.getContext((context) => {
            getQuestions(context.meetingId!)
                .then((res) => {
                    console.log(res)
                    const questions = res.data as IQuestionDetails[];
                    const inMeetingQuestions = questions.map((questionDetail) => {
                        return {
                            ...questionDetail,
                            rating: 0,
                            comment: '',
                            commentedBy: ''
                        }
                    })
                    setQuestionDetails(inMeetingQuestions)
                })
                .catch((ex) => {
                    console.log("Error while getting the question details" + ex)
                });
        });
    }

    // Method to submit feedback for all questions.
    const submitFeedback = () => {
        saveFeedback(questionDetails)
            .then((res) => {
                console.log(res)
            })
            .catch((ex) => {
                console.log("Error while submitting the feedback.")
                console.log(ex)
            });
    }

    React.useEffect(() => {
        microsoftTeams.initialize();
        loadQuestions();
    }, [])


    return (
        <>
            {/* Content for stage view */}
            <Flex hidden={window.innerWidth < 600} gap="gap.small" padding="padding.medium" className="container">
                <Flex column gap="gap.small" padding="padding.medium" className="detailsContainer">
                    <BasicDetails setSelectedCandidateIndex={setSelectedCandidateIndex}/>
                    <Timeline />
                    <Notes currentCandidateEmail={currentCandidateEmail}/>
                </Flex>
                <Flex column gap="gap.small" padding="padding.medium" className="questionsContainer">
                    <Questions />
                </Flex>
            </Flex>

            {/* Content for sidepanel/mobile view */}
            <Flex hidden={window.innerWidth < 600} gap="gap.small" padding="padding.medium" className="container-mobile" column>
                <Menu
                    defaultActiveIndex={0}
                    items={mobileMenuItems}
                    underlined
                    onItemClick={(event: any, options: any) => setActiveMobileMenu(options.index)}
                    className="menu-item"
                    primary />
                <Flex column gap="gap.small">
                    <>
                        {!activeMobileMenu && <BasicDetailsMobile selectedIndex={selectedIndex} />}
                        {questionDetails.length > 0 && activeMobileMenu == 1 &&
                            <Flex column>
                                <Flex column gap="gap.smaller" className="questionCardsMobile">
                                    <QuestionsMobile
                                        questionsSet={questionDetails}
                                        setRating={setRating}
                                        saveComment={saveComment}
                                        setShowAddComment={setShowAddComment} />
                                </Flex>
                                <Flex gap="gap.smaller">
                                    <Button
                                        size="small"
                                        content="Discard"
                                        secondary
                                        onClick={loadQuestions} />
                                    <Button size="small" content="Submit" primary onClick={submitFeedback} />
                                </Flex>
                            </Flex>
                        }
                    </>
                </Flex>
            </Flex>
        </>
    )
}

export default (RecruitingDetails);