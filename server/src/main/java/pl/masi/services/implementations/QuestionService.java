package pl.masi.services.implementations;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.QuestionBean;
import pl.masi.entities.Choice;
import pl.masi.entities.Test;
import pl.masi.enums.QuestionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.TestRepository;
import pl.masi.services.interfaces.IQuestionService;
import pl.masi.repositories.QuestionRepository;
import pl.masi.entities.Question;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class QuestionService implements IQuestionService {

    @Autowired
    private TestRepository testRepository;
    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void add(QuestionBean questionBean) {
        Question newQuestion = Question.builder()
                .name(questionBean.getName())
                .content(questionBean.getContent())
                .tests(questionBean.getTests())
                .questionType(questionBean.getQuestionType())
                .build();
        if (newQuestion.getQuestionType().toString().equals("CHOICE")) {
            List<Choice> choices = new ArrayList<>();
            questionBean.getChoices().forEach(ch -> {
                choices.add(Choice.builder().content(ch.getContent()).question(newQuestion).build());
            });
            newQuestion.setChoices(choices);
        }
        questionRepository.save(newQuestion);
    }

    @Override
    public Question getByName(String name) throws AppException {
        Question question = questionRepository.findByName(name);
        if (question == null) {
            throw new AppException("QUESTION_NOT_FOUND", "Question with " + name + " name doesn't exists");
        }
        return question;
    }

    @Override
    public List<Question> getAllQuestions() {
        return (List<Question>) questionRepository.findAll();
    }

    @Override
    public void update(QuestionBean questionBean) throws AppException {
        Question question = getByName(questionBean.getName());
        question.setContent(questionBean.getContent());
        questionRepository.save(question);
    }

    @Override
    public void deleteByName(String name) throws AppException {
        Question questionToDelete = getByName(name);
        List<Test> testsToUpdate = testRepository.findByQuestionsName(name);
        if (testsToUpdate != null) {
            for (Test test : testsToUpdate) {
                test.getQuestions().remove(questionToDelete);
                test.setQuestions(test.getQuestions());
                testRepository.save(test);
            }
        }
        questionRepository.deleteByName(questionToDelete.getName());
    }

    @Override
    public List<String> getAllQuestionType() {
        List<String> questionTypes = new ArrayList<>();
        for (QuestionType type : questionRepository.getAllQuestionType()) {
            questionTypes.add(type.name());
        }
        return questionTypes;
    }
}
