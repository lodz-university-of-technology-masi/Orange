package pl.masi.services.interfaces;
import pl.masi.beans.QuestionBean;
import pl.masi.entities.Question;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface IQuestionService {

    void add(QuestionBean questionBean);

    Question getByName(String name) throws AppException;

    List<Question> getAllQuestions();

    void deleteByName(String name) throws AppException;

    List<String> getAllQuestionType();
}
