define(["esri/core/Accessor"], function(Accessor) {
    var Person = Accessor.createSubclass({
        properties: {
            firstName: {
                value: "John" //默认值为Jonh
            },
            lastName: {
                value: "Doe" //默认值为Doe
            },
            fullName: {
                readOnly: true, //只读属性
                dependsOn: ["firstName", "lastName"], //依赖关系
                get: function() {
                    return this.firstName + " " + this.lastName;
                } //get方法重写
            }
        }
    });
    var person = new Person();
    //fullName属性更新监听
    person.watch("fullName", function(newVal, oldVal) {
        document.getElementById("greetings").innerHTML =
            "Hello " + newVal + "!<br/>" + "Bye " + oldVal + "!";
    });
    document.getElementById("confirm").addEventListener("click", function() {
        person.set({
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value
        });
    });
});
